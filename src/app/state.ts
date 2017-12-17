import { RouterReducerState } from '@ngrx/router-store';

import * as blog from './blog';

export interface State {
  blog: blog.State;
  router: RouterReducerState;
}
