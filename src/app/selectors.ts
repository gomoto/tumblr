import { createSelector } from 'reselect';
import { State } from './state';
import * as blog from './blog';

// project selectors
export const blogState = (state: State) => state.blog;
export const blogCursor = createSelector(blogState, blog.selectors.cursor);
export const blogPosts = createSelector(blogState, blog.selectors.posts);
export const blogPostsSortedByNoteCount = createSelector(blogPosts, (postsById) => {
  const result = Object.keys(postsById).map((postId) => postsById[postId]).slice().sort(function(a, b) {
    return b.notes - a.notes;
  });
  return result;
});
