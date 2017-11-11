import { Post } from './model';

export interface State {
  cursor: number;
  posts: {
    [postId: string]: Post;
  }
}
