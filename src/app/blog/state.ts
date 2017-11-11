import { Post } from './model';

export interface State {
  posts: {
    [postId: string]: Post;
  }
}
