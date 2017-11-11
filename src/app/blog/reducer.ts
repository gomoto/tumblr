import * as actionTypes from './action-types';
import { BlogAction } from './actions';
import { State } from './state';

const initialState: State = {
  cursor: 0,
  posts: {}
};

export function reducer(state = initialState, action: BlogAction) {
  switch(action.type) {
    case actionTypes.FETCH_POSTS_SUCCESS: {
      // Merge in new posts; update cursor position.
      const posts = action.payload.posts;
      const fetchedPostsById = posts.reduce((_fetchedPostsById, post) => {
        _fetchedPostsById[post.id] = post;
        return _fetchedPostsById;
      }, {});
      return {
        cursor: state.cursor + posts.length,
        posts: Object.assign({}, state.posts, fetchedPostsById)
      };
    }
    case actionTypes.DELETE_ALL_POSTS: {
      return {
        cursor: state.cursor,
        posts: {}
      }
    }
    default: {
      return state;
    }
  }
}
