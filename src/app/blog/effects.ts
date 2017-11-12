import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import * as actions from './actions';
import * as actionTypes from './action-types';
import { Post } from './model';
import { BlogService } from './service';
import { InfoResponse, PostsResponse } from '../tumblr';

@Injectable()
export class BlogEffects {
  constructor(
    private actions$: Actions,
    private blogService: BlogService
  ) {}

  // Log all actions.
  @Effect({dispatch: false})
  logAllActions$ = this.actions$
  .pipe(
    tap<Action>((action) => {
      console.debug(`Action: ${action.type}`, action['payload']);
    })
  )

  @Effect()
  fetchInfo$ = this.actions$
  .ofType(actionTypes.FETCH_INFO)
  .pipe(
    mergeMap((action: actions.FetchInfo) => {
      const apiKey = action.payload.apiKey;
      const blogName = action.payload.blogName;
      return this.blogService.fetchInfo(blogName, apiKey)
      .pipe(
        map<InfoResponse, actions.FetchInfoSuccess>((infoResponse) => {
          const blog = infoResponse.response.blog;
          return new actions.FetchInfoSuccess({
            blogName: blog.name,
            blogSize: blog.posts
          });
        }),
        catchError<any, actions.FetchInfoFail>((error) => Observable.of(new actions.FetchInfoFail({blogName, apiKey, error})))
      )
    })
  )

  @Effect()
  fetchPosts$ = this.actions$
  .ofType(actionTypes.FETCH_POSTS)
  .pipe(
    mergeMap((action: actions.FetchPosts) => {
      const apiKey = action.payload.apiKey;
      const blogName = action.payload.blogName;
      const offset = action.payload.offset;
      const limit = action.payload.limit;
      return this.blogService.fetchPosts(blogName, apiKey, limit, offset)
      .pipe(
        map<PostsResponse, actions.FetchPostsSuccess>((postsResponse) => {
          const posts: Post[] = postsResponse.response.posts.map((post) => ( <Post> {
            id: `${post.id}`,
            date: post.date,
            link: `https://${post.blog_name}.tumblr.com/post/${post.id}`,
            notes: post.note_count,
            type: post.type,
            // Use smallest version of first image in the post.
            imagePreviewUrl: (
              post.photos &&
              post.photos[0] &&
              post.photos[0].alt_sizes &&
              post.photos[0].alt_sizes[post.photos[0].alt_sizes.length - 1] &&
              post.photos[0].alt_sizes[post.photos[0].alt_sizes.length - 1].url ||
              null
            ),
            imageUrl: (
              post.photos &&
              post.photos[0] &&
              post.photos[0].original_size &&
              post.photos[0].original_size.url ||
              null
            ),
            videoPreviewUrl: post.thumbnail_url,
            videoUrl: post.video_url
          }));
          return new actions.FetchPostsSuccess({posts});
        }),
        catchError<any, actions.FetchPostsFail>((error) => Observable.of(new actions.FetchPostsFail({blogName, apiKey, error})))
      )
    })
  )
}
