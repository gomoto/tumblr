import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as selectors from './selectors';
import { State } from './state';
import * as _blog from './blog';

const apiKey = 'u9oKp2z6VfHuyX7mkfX40S2uSfjZpYSKc6EkMWo2F9SbVtM1hS';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tumblrForm: FormGroup;
  name: string;
  size: number;
  cursor: number;
  posts$: Observable<_blog.Post[]>;

  // Manage all rxjs subscriptions in one place.
  private _subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<State>
  ) {
    this.tumblrForm = this.formBuilder.group({
      blog: this.formBuilder.control('')
    });
    const nameSubscription = this.store.select(selectors.blogName).subscribe((name) => {
      this.name = name;
    });
    const sizeSubscription = this.store.select(selectors.blogSize).subscribe((size) => {
      this.size = size;
    });
    const cursorSubscription = this.store.select(selectors.blogCursor).subscribe((cursor) => {
      this.cursor = cursor;
    });
    this.posts$ = this.store.select(selectors.blogPostsSortedByNoteCount);
    this._subscriptions.add(nameSubscription);
    this._subscriptions.add(sizeSubscription);
    this._subscriptions.add(cursorSubscription);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  getInfo(): void {
    const blogName: string = this.tumblrForm.get('blog').value;
    this.store.dispatch(new _blog.actions.FetchInfo({blogName, apiKey}));
  }

  getPosts(): void {
    this.store.dispatch(new _blog.actions.FetchPosts({
      blogName: this.name,
      apiKey: apiKey,
      offset: this.cursor
    }));
  }

  deleteAllPosts(): void {
    this.store.dispatch(new _blog.actions.DeleteAllPosts());
  }
}
