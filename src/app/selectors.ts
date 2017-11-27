import { createSelector } from 'reselect';
import { State } from './state';
import * as blog from './blog';
import * as tumblr from './tumblr';

// project selectors
export const blogState = (state: State) => state.blog;
export const blogSize = createSelector(blogState, blog.selectors.size);
export const blogPosts = createSelector(blogState, blog.selectors.posts);
export const blogPostTypes = createSelector(blogState, blog.selectors.postTypes);
export const blogPostsSortedByNoteCount = createSelector(blogPosts, (postsById) => {
  const result = Object.keys(postsById).map((postId) => postsById[postId]).slice().sort(function(a, b) {
    return b.notes - a.notes;
  });
  return result;
});
export const blogPostsSortedByNoteCountFilteredByType = createSelector(blogPosts, blogPostTypes, (postsById, postTypes) => {
  const posts = Object.keys(postsById).map((postId) => postsById[postId]);
  const filteredPosts = posts.filter((post) => postTypes.indexOf(post.type) > -1);
  const filteredSortedPosts = filteredPosts.slice().sort((a, b) => b.notes - a.notes);
  return filteredSortedPosts;
});
