import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  start: number;
  end: number;
  size: number;
  posts$: Observable<_blog.Post[]>;
  postTypeForm: FormGroup;

  // Manage all rxjs subscriptions in one place.
  private _subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
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

      // Ranges need to be converted here. Example:
      // Human-friendly range is 1-10, including 10.
      // Machine-friendly range is 0-10, excluding 10.
      this.store.dispatch(new _blog.actions.FetchPosts({
        blogName: this.name,
        apiKey: apiKey,
        start: this.start - 1,
        end: this.end
      }));
    });

    // Create post type checkboxes.
    this.postTypeForm = this.formBuilder.group({
      photo: false,
      video: false
    });

    // Whenever post type checkboxes change, dispatch action.
    this.postTypeForm.valueChanges.subscribe((x) => {
      const postTypes: tumblr.TumblrPostType[] = [];
      if (this.postTypeForm.get('photo').value) {
        postTypes.push('photo');
      }
      if (this.postTypeForm.get('video').value) {
        postTypes.push('video');
      }
      this.store.dispatch(new _blog.actions.SetPostTypes({postTypes}));
    });

    const sizeSubscription = this.store.select(selectors.blogSize).subscribe((size) => {
      this.size = size;
    });

    // Initialize post type checkboxes with take(1).
    const postTypesSubscription = this.store.select(selectors.blogPostTypes).pipe(
      take<tumblr.TumblrPostType[]>(1)
    )
    .subscribe((types) => {
      console.debug('Initializing values for post type checkboxes');
      this.postTypeForm.setValue({
        photo: types.indexOf('photo') > -1,
        video: types.indexOf('video') > -1
      });
    });

    this.posts$ = this.store.select(selectors.blogPostsSortedByNoteCountFilteredByType);
    this._subscriptions.add(queryParamMapSubscription);
    this._subscriptions.add(sizeSubscription);
    this._subscriptions.add(postTypesSubscription);
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
        start: this.end + 1,
        end: this.end + 1 + this.end - this.start
      }
    });
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
