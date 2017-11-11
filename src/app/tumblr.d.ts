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
