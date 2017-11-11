import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as request from 'request';
import { Observable, Subscription } from 'rxjs';
import { InfoResponse, PostsResponse } from './tumblr';
import { Store } from '@ngrx/store';
import * as selectors from './selectors';
import { State } from './state';
import * as _blog from './blog';

const apiKey = 'u9oKp2z6VfHuyX7mkfX40S2uSfjZpYSKc6EkMWo2F9SbVtM1hS';

interface Blog {
  name: string;
  postCount: number;
  posts: Post[];
}

interface Post {
  date: string;  // Date
  link: string;
  notes: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tumblrForm: FormGroup;
  blog: Blog | null;
  posts$: Observable<Post[]>;
  cursor: number;

  // Manage all rxjs subscriptions in one place.
  private _subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<State>
  ) {
    this.tumblrForm = this.formBuilder.group({
      blog: this.formBuilder.control('')
    });
    this.blog = null;
    this.posts$ = this.store.select(selectors.blogPostsSortedByNoteCount);
    const cursorSubscription = this.store.select(selectors.blogCursor).subscribe((cursor) => {
      this.cursor = cursor;
    });
    this._subscriptions.add(cursorSubscription);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  submitTumblrForm(): void {
    const blogControl = this.tumblrForm.get('blog') as FormControl;
    const blog = blogControl.value;
    const url = `https://api.tumblr.com/v2/blog/${blog}/info?api_key=${apiKey}`;
    request(url, (error, response, body) => {
      const data: InfoResponse = JSON.parse(body);
      const blog = data.response.blog;
      this.blog = {
        name: blog.name,
        postCount: blog.posts,
        posts: []
      };
    });
  }

  getPosts(): void {
    if (this.blog === null) {
      throw new Error('blog must be defined before getting posts');
    }
    this.store.dispatch(new _blog.actions.FetchPosts({
      blogName: this.blog.name,
      apiKey: apiKey,
      offset: this.cursor
    }));
  }

  deleteAllPosts(): void {
    this.store.dispatch(new _blog.actions.DeleteAllPosts());
  }
}
