import { Post } from './model';

export interface State {
  // Blog name is unique.
  name: string;
  // Total number of posts.
  size: number;
  cursor: number;
  posts: {
    [postId: string]: Post;
  }
}
