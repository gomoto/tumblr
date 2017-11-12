// Interfaces of the tumblr API.

// Blog info.
// Response from api.tumblr.com/v2/blog/{blog}/info?api_key={key}
export interface InfoResponse {
  meta: {
    status: number;
    msg: string;
  }
  response: {
    blog: {
      ask: boolean;
      ask_anon: boolean;
      ask_page_title: string;
      can_subscribe: boolean;
      description: string;
      is_adult: boolean;
      is_nsfw: boolean;
      is_optout_ads: boolean;
      name: string;
      posts: number;
      reply_conditions: string;
      share_likes: boolean;
      subscribed: boolean;
      title: string;
      total_posts: number;
      updated: number;
      url: string;
    }
  }
}

// Posts.
// Response from api.tumblr.com/v2/blog/{blog}/posts?api_key={key}
export interface PostsResponse {
  meta: {
    status: number;
    msg: string;
  }
  response: {
    blog: {
      ask: boolean;
      ask_anon: boolean;
      ask_page_title: string;
      can_subscribe: boolean;
      description: string;
      is_adult: boolean;
      is_nsfw: boolean;
      is_optout_ads: boolean;
      name: string;
      posts: number;
      reply_conditions: string;
      share_likes: boolean;
      subscribed: boolean;
      title: string;
      total_posts: number;
      updated: number;
      url: string;
    }
    posts: TumblrPost[];
  }
}

export interface TumblrPost {
  blog_name: string;
  can_like: boolean;
  can_reblog: boolean;
  can_reply: boolean;
  can_send_in_message: boolean;
  caption: string;
  date: string;
  display_avatar: boolean;
  format: string;
  id: number;
  image_permalink: string;
  is_blocks_post_format: boolean;
  link_url: string;
  note_count: number;
  // Photo posts only:
  photos: {
    alt_sizes: TumblrPhoto[];
    caption: string;
    original_size: TumblrPhoto;
  }[]
  post_url: string;
  reblog: {
    comment: string;
    tree_html: string;
  }
  reblog_key: string;
  short_url: string;
  slug: string;
  state: string;
  summary: string;
  tags: string[];
  // Video posts only:
  thumbnail_url: string;
  timestamp: number;
  // All posts:
  type: string;
  // Video posts only:
  video_url: string;
}

export interface TumblrPhoto {
  url: string;
  width: number;
  height: number;
}
