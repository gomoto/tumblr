import * as actionTypes from './action-types';
import { BlogAction } from './actions';
import { State } from './state';

const initialState: State = {
  size: 0,
  posts: {},
  postTypes: []
};

export function reducer(state = initialState, action: BlogAction): State {
  switch(action.type) {
    case actionTypes.FETCH_INFO_SUCCESS: {
      return {
        size: action.payload.blogSize,
        // Reset cursor and posts for new blog.
        posts: state.posts,
        postTypes: state.postTypes
      }
    }
    case actionTypes.FETCH_POSTS_SUCCESS: {
      const posts = action.payload.posts;
      const fetchedPostsById = posts.reduce((_fetchedPostsById, post) => {
        _fetchedPostsById[post.id] = post;
        return _fetchedPostsById;
      }, {});
      return {
        size: state.size,
        // Overwrite instead of merge
        posts: fetchedPostsById, //  Object.assign({}, state.posts, fetchedPostsById)
        postTypes: state.postTypes
      };
    }
    case actionTypes.DELETE_ALL_POSTS: {
      return {
        size: state.size,
        posts: {},
        postTypes: state.postTypes
      }
    }
    default: {
      return state;
    }
  }
}
