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
  types: string[];
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
    this.types = activatedRoute.snapshot.queryParams.types || [];

    const startEndSubscription = activatedRoute.queryParamMap.subscribe((queryParamMap) => {
      // Validate start and end.
      let start = parseInt(queryParamMap.get('start'));
      let end = parseInt(queryParamMap.get('end'));
      if (isNaN(start)) {
        start = 1;
      }
      if (isNaN(end)) {
        end = 20;
      }
      if (start < 1) {
        throw new Error('Bad query param for start');
      }
      // TODO: validate end param against total size.
      if (start > end) {
        throw new Error('Bad query params for start and end');
      }

      // Only fetch posts if start value or end value has changed.
      if (this.start === start && this.end === end) {
        return;
      }

      this.start = start;
      this.end = end;

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

    // Initialize post type checkboxes from URL.
    this.postTypeForm = this.formBuilder.group({
      photo: this.types.indexOf('photo') > -1,
      video: this.types.indexOf('video') > -1
    });

    // Whenever post type checkboxes change, update URL.
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

    this.posts$ = this.store.select(selectors.blogPostsSortedByNoteCountFilteredByType);
    this._subscriptions.add(startEndSubscription);
    this._subscriptions.add(sizeSubscription);
  }

  ngOnInit(): void {
    const blogName = this.name;
    this.store.dispatch(new _blog.actions.FetchInfo({blogName, apiKey}));
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  canGoToPreviousChunk(): boolean {
    const diff = this.end - this.start;
    const start = this.start - 1 - diff;
    return start >= 1;
  }

  // TODO
  canGoToNextChunk(): boolean {
    return true;
  }

  goToPreviousChunk(): void {
    const diff = this.end - this.start;
    const start = this.start - 1 - diff;
    const end = this.start - 1;
    if (start < 1) {
      return;
    }
    const queryParams = { start, end };
    // Include types query param only if there are any types.
    if (this.types.length > 0) {
      Object.assign(queryParams, {
        types: this.types
      });
    }
    this.router.navigate([this.name], { queryParams });
  }

  goToNextChunk(): void {
    const diff = this.end - this.start;
    const start = this.end + 1;
    const end = this.end + 1 + diff;
    const queryParams = { start, end };
    // Include types query param only if there are any types.
    if (this.types.length > 0) {
      Object.assign(queryParams, {
        types: this.types
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
