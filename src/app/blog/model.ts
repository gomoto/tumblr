import * as tumblr from '../tumblr';

export interface Post {
  id: string;
  date: string;
  link: string;
  notes: number;
  type: tumblr.TumblrPostType;
  imageUrl: string;
  imagePreviewUrl: string;
  videoUrl: string;
  videoPreviewUrl: string;
}
