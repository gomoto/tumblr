import { createSelector } from 'reselect';
import { State } from './state';
import * as blog from './blog';
import * as tumblr from './tumblr';

// Selectors for URL state.
export const routerState = (state: State) => state.router;
export const postTypes = createSelector(routerState, (routerState) => {
  return routerState.state.root.queryParamMap.getAll('types');
});
export const startEnd = createSelector(routerState, (routerState) => {
  const queryParamMap = routerState.state.root.queryParamMap;

  // Validate start and end.
  let start = parseInt(queryParamMap.get('start'));
  let end = parseInt(queryParamMap.get('end'));
  if (isNaN(start)) {
    start = 1;
  }
  if (isNaN(end)) {
    end = 20;
  }
  if (start < 1) {
    throw new Error('Bad query param for start');
  }
  // TODO: validate end param against total size.
  if (start > end) {
    throw new Error('Bad query params for start and end');
  }
  return { start, end };
});

// project selectors
export const blogState = (state: State) => state.blog;
export const blogSize = createSelector(blogState, blog.selectors.size);
export const blogPosts = createSelector(blogState, blog.selectors.posts);
export const blogPostsSortedByNoteCount = createSelector(blogPosts, (postsById) => {
  const result = Object.keys(postsById).map((postId) => postsById[postId]).slice().sort(function(a, b) {
    return b.notes - a.notes;
  });
  return result;
});
export const blogPostsSortedByNoteCountFilteredByType = createSelector(blogPosts, postTypes, (postsById, postTypes) => {
  const posts = Object.keys(postsById).map((postId) => postsById[postId]);
  const filteredPosts = posts.filter((post) => postTypes.indexOf(post.type) > -1);
  const filteredSortedPosts = filteredPosts.slice().sort((a, b) => b.notes - a.notes);
  return filteredSortedPosts;
});
