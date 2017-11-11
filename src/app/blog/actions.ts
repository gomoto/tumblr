import { Action } from '@ngrx/store';
import * as actionTypes from './action-types';
import { Post } from './model';

export class FetchPosts implements Action {
  readonly type = actionTypes.FETCH_POSTS;
  constructor(public payload: {
    blogName: string,
    apiKey: string
  }) {}
}

export class FetchPostsSuccess implements Action {
  readonly type = actionTypes.FETCH_POSTS_SUCCESS;
  constructor(public payload: {
    posts: Post[]
  }) {}
}

export class FetchPostsFail implements Action {
  readonly type = actionTypes.FETCH_POSTS_FAIL;
  constructor(public payload: {
    blogName: string,
    apiKey: string,
    error: any
  }) {}
}

export type BlogAction =
  FetchPosts |
  FetchPostsSuccess |
  FetchPostsFail;
