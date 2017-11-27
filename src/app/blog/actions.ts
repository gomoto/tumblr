import { Action } from '@ngrx/store';
import * as actionTypes from './action-types';
import { Post } from './model';
import * as tumblr from '../tumblr';

export class FetchInfo implements Action {
  readonly type = actionTypes.FETCH_INFO;
  constructor(public payload: {
    blogName: string,
    apiKey: string
  }) {}
}

export class FetchInfoSuccess implements Action {
  readonly type = actionTypes.FETCH_INFO_SUCCESS;
  constructor(public payload: {
    blogName: string,
    blogSize: number
  }) {}
}

export class FetchInfoFail implements Action {
  readonly type = actionTypes.FETCH_INFO_FAIL;
  constructor(public payload: {
    blogName: string,
    apiKey: string,
    error: any
  }) {}
}

export class FetchPosts implements Action {
  readonly type = actionTypes.FETCH_POSTS;
  constructor(public payload: {
    blogName: string,
    apiKey: string,
    start: number,
    end: number
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

export class DeleteAllPosts implements Action {
  readonly type = actionTypes.DELETE_ALL_POSTS;
}

export class SetPostTypes implements Action {
  readonly type = actionTypes.SET_POST_TYPES;
  constructor(public payload: {
    postTypes: tumblr.TumblrPostType[]
  }) {}
}

export class SetPostTypesSuccess implements Action {
  readonly type = actionTypes.SET_POST_TYPES_SUCCESS;
  constructor(public payload: {
    postTypes: tumblr.TumblrPostType[]
  }) {}
}

export class Null implements Action {
  readonly type = 'NULL';
}

export type BlogAction =
  FetchInfo |
  FetchInfoSuccess |
  FetchInfoFail |
  FetchPosts |
  FetchPostsSuccess |
  FetchPostsFail |
  DeleteAllPosts |
  SetPostTypes |
  SetPostTypesSuccess |
  Null;
