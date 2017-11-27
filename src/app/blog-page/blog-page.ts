import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as selectors from '../selectors';
import { State } from '../state';
import * as _blog from '../blog';
import * as tumblr from '../tumblr';

const apiKey = 'u9oKp2z6VfHuyX7mkfX40S2uSfjZpYSKc6EkMWo2F9SbVtM1hS';

@Component({
  selector: 'blog-page',
  templateUrl: './blog-page.html',
  styleUrls: ['./blog-page.scss']
})
export class BlogPage {
  name: string;
  type: tumblr.TumblrPostType | '';
  start: number;
  end: number;
  size: number;
  posts$: Observable<_blog.Post[]>;

  // Manage all rxjs subscriptions in one place.
  private _subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<State>
  ) {
    this.name = activatedRoute.snapshot.params.blogName;

    const queryParamMapSubscription = activatedRoute.queryParamMap.subscribe((queryParamMap) => {
      // Validate start and end.
      this.start = parseInt(queryParamMap.get('start'));
      this.end = parseInt(queryParamMap.get('end'));
      if (isNaN(this.start)) {
        this.start = 1;
      }
      if (isNaN(this.end)) {
        this.end = 20;
      }
      if (this.start < 1) {
        throw new Error('Bad query param for start');
      }
      // TODO: validate end param against total size.
      if (this.start > this.end) {
        throw new Error('Bad query params for start and end');
      }

      // Validate post type.
      const type = queryParamMap.get('type') || null;
      switch (type) {
        case null: {
          this.type = '';
          break;
        }
        case 'answer':
        case 'audio':
        case 'chat':
        case 'link':
        case 'photo':
        case 'quote':
        case 'text':
        case 'video': {
          this.type = type;
          break;
        }
        default: {
          throw new Error('Bad query param for type. Must be one of: answer, audio, chat, link, photo, quote, text, video');
        }
      }

      // Ranges need to be converted here. Example:
      // Human-friendly range is 1-10, including 10.
      // Machine-friendly range is 0-10, excluding 10.
      this.store.dispatch(new _blog.actions.FetchPosts({
        blogName: this.name,
        apiKey: apiKey,
        type: this.type,
        start: this.start - 1,
        end: this.end
      }));
    });

    const sizeSubscription = this.store.select(selectors.blogSize).subscribe((size) => {
      this.size = size;
    });
    this.posts$ = this.store.select(selectors.blogPostsSortedByNoteCount);
    this._subscriptions.add(queryParamMapSubscription);
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
    let queryParams = {
      start: this.end + 1,
      end: this.end + 1 + this.end - this.start
    };
    if (this.type) {
      Object.assign(queryParams, {
        type: this.type
      });
    }
    this.router.navigate([this.name], { queryParams });
  }

  deleteAllPosts(): void {
    this.store.dispatch(new _blog.actions.DeleteAllPosts());
  }

  getPostResourceUrl(post: _blog.Post): string {
    switch(post.type) {
      case 'photo': {
        return post.imageUrl || post.link;
      }
      case 'video': {
        return post.videoUrl || post.link;
      }
      default: {
        return post.link;
      }
    }
  }

  getPostResourcePreviewUrl(post: _blog.Post): string {
    switch(post.type) {
      case 'photo': {
        return post.imagePreviewUrl || '';
      }
      case 'video': {
        return post.videoPreviewUrl || '';
      }
      default: {
        return '';
      }
    }
  }
}
