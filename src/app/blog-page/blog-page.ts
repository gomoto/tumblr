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

    store.select(selectors.startEnd).subscribe((range) => {
      // Fetch posts only if range has changed.
      if (range.start === this.start && range.end === this.end) {
        return;
      }
      this.start = range.start;
      this.end = range.end;
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

    store.select(selectors.postTypes).subscribe((types) => {
      console.dir(types);
    });

    this.posts$ = this.store.select(selectors.blogPostsSortedByNoteCountFilteredByType);
    this._subscriptions.add(sizeSubscription);
  }

  ngOnInit(): void {
    const blogName = this.name;
    this.store.dispatch(new _blog.actions.FetchInfo({blogName, apiKey}));
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  private getPreviousRange(start: number, end: number): { start: number, end: number } {
    const diff = end - start;
    const newStart = start - 1 - diff;
    const newEnd = start - 1;
    return { start: newStart, end: newEnd };
  }

  private getNextRange(start: number, end: number): { start: number, end: number } {
    const diff = this.end - this.start;
    const newStart = this.end + 1;
    const newEnd = this.end + 1 + diff;
    return { start: newStart, end: newEnd };
  }

  canGoToPreviousChunk(): boolean {
    const { start } = this.getPreviousRange(this.start, this.end);
    return start >= 1;
  }

  // TODO
  canGoToNextChunk(): boolean {
    return true;
  }

  goToPreviousChunk(): void {
    const previousRange = this.getPreviousRange(this.start, this.end);
    const { start, end } = previousRange;
    if (start < 1) {
      return;
    }
    this.store.dispatch(new _blog.actions.SetPostRange({ start, end }));
  }

  goToNextChunk(): void {
    const nextRange = this.getNextRange(this.start, this.end);
    const { start, end } = nextRange;
    this.store.dispatch(new _blog.actions.SetPostRange({ start, end }));
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
