import { Post } from './model';
import * as tumblr from '../tumblr';

export interface State {
  // Total number of posts.
  size: number;
  posts: {
    [postId: string]: Post;
  }
}
