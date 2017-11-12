import { Post } from './model';

export interface State {
  // Total number of posts.
  size: number;
  posts: {
    [postId: string]: Post;
  }
}
