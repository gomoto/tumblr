import * as actionTypes from './action-types';
import { BlogAction } from './actions';
import { State } from './state';

const initialState: State = {
  posts: {}
};

export function reducer(state = initialState, action: BlogAction) {
  switch(action.type) {
    case actionTypes.FETCH_POSTS_SUCCESS: {
      // Merge in new posts.
      const posts = action.payload.posts;
      const fetchedPostsById = posts.reduce((_fetchedPostsById, post) => {
        _fetchedPostsById[post.id] = post;
        return _fetchedPostsById;
      }, {});
      return {
        posts: Object.assign({}, state.posts, fetchedPostsById)
      };
    }
    default: {
      return state;
    }
  }
}
