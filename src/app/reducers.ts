import { routerReducer } from '@ngrx/router-store';

import * as blog from './blog';

// Map of reducers should have the same top-level keys as state.
export const reducers = {
  router: routerReducer,
  blog: blog.reducer
};
