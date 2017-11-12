import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as selectors from '../selectors';
import { State } from '../state';
import * as _blog from '../blog';

const apiKey = 'u9oKp2z6VfHuyX7mkfX40S2uSfjZpYSKc6EkMWo2F9SbVtM1hS';

@Component({
  selector: 'blog-page',
  templateUrl: './blog-page.html',
  styleUrls: ['./blog-page.scss']
})
export class BlogPage {
  name: string;
  size: number;
  cursor: number;
  posts$: Observable<_blog.Post[]>;

  // Manage all rxjs subscriptions in one place.
  private _subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<State>
  ) {
    this.name = activatedRoute.snapshot.params.blogName;

    const cursorSubscription = activatedRoute.queryParamMap.subscribe((queryParamMap) => {
      this.cursor = parseInt(queryParamMap.get('cursor'));
      if (isNaN(this.cursor)) {
        this.cursor = 0;
      }
      this.store.dispatch(new _blog.actions.FetchPosts({
        blogName: this.name,
        apiKey: apiKey,
        offset: this.cursor
      }));
    });

    const sizeSubscription = this.store.select(selectors.blogSize).subscribe((size) => {
      this.size = size;
    });
    this.posts$ = this.store.select(selectors.blogPostsSortedByNoteCount);
    this._subscriptions.add(sizeSubscription);
  }

  ngOnInit(): void {
    const blogName = this.name;
    this.store.dispatch(new _blog.actions.FetchInfo({blogName, apiKey}));
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  getPosts(): void {
    this.router.navigate([this.name], {
      queryParams: {
        cursor: this.cursor + 20
      }
    });
  }

  deleteAllPosts(): void {
    this.store.dispatch(new _blog.actions.DeleteAllPosts());
  }

  getPostResourceUrl(post: _blog.Post): string {
    switch(post.type) {
      case 'photo': {
        return post.imageUrl;
      }
      case 'video': {
        return post.videoUrl;
      }
      default: {
        return post.link;
      }
    }
  }

  getPostResourcePreviewUrl(post: _blog.Post): string {
    switch(post.type) {
      case 'photo': {
        return post.imagePreviewUrl;
      }
      case 'video': {
        return post.videoPreviewUrl;
      }
      default: {
        return '';
      }
    }
  }
}
