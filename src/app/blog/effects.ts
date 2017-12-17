import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as isArray from 'isarray';
import * as arrayXor from 'array-xor';

import * as actions from './actions';
import * as actionTypes from './action-types';
import { Post } from './model';
import { BlogService } from './service';
import { InfoResponse, PostsResponse, TumblrPostType } from '../tumblr';

@Injectable()
export class BlogEffects {
  private previousPostTypes: TumblrPostType[];

  constructor(
    private actions$: Actions,
    private blogService: BlogService,
    private router: Router
  ) {
    this.previousPostTypes = [];
  }

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
      const start = action.payload.start;
      const end = action.payload.end;
      return this.blogService.fetchPosts(blogName, apiKey, start, end)
      .pipe(
        map<Post[], actions.FetchPostsSuccess>((posts) => new actions.FetchPostsSuccess({posts})),
        catchError<any, actions.FetchPostsFail>((error) => Observable.of(new actions.FetchPostsFail({blogName, apiKey, error})))
      )
    })
  )

  // SetPostRange action -> router navigation.
  @Effect({dispatch: false})
  setPostRange$ = this.actions$
  .ofType(actionTypes.SET_POST_RANGE)
  .pipe(
    tap<actions.SetPostRange>((action) => {
      const start = action.payload.start;
      const end = action.payload.end;
      // Include start and end query params only if they exist.
      // Pass through all other query params; start with a clone of query params.
      const queryParams = Object.assign({}, this.router.routerState.snapshot.root.queryParams);
      if (start && start > 0) {
        queryParams.start = start;
      } else {
        delete queryParams.start;
      }
      if (end && end > 0) {
        queryParams.end = end;
      } else {
        delete queryParams.end;
      }
      this.router.navigate([/* same state */], { queryParams });
    })
  )

  // SetPostTypes action -> router navigation.
  @Effect({dispatch: false})
  setPostTypesInUrl$ = this.actions$
  .ofType(actionTypes.SET_POST_TYPES)
  .pipe(
    tap<actions.SetPostTypes>((action) => {
      const types = action.payload.postTypes;
      // Clone query params.
      const queryParams = Object.assign({}, this.router.routerState.snapshot.root.queryParams);
      // Include types query param only if there are any types.
      if (types.length > 0) {
        queryParams['types'] = types;
      } else {
        delete queryParams['types'];
      }
      this.router.navigate([/* same state */], { queryParams });
    })
  )

  // Router navigation -> SetPostTypes action iff types changed.
  @Effect()
  setPostTypes$ = this.actions$
  .ofType(ROUTER_NAVIGATION)
  .pipe(
    map<RouterNavigationAction, actions.SetPostTypesSuccess | actions.Null>((action) => {
      let types = action.payload.routerState.root.queryParams.types || [];
      if (!isArray(types)) {
        types = [types];
      }
      const symmetricDiff: TumblrPostType[] = arrayXor(this.previousPostTypes, types);
      this.previousPostTypes = types;
      if (symmetricDiff.length === 0) {
        return new actions.Null();
      }
      return new actions.SetPostTypesSuccess({postTypes: types});
    })
  )
}
