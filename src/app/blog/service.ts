import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/observable/forkJoin';

import { Post } from './model';
import { InfoResponse, PostsResponse, TumblrPost } from '../tumblr';

@Injectable()
export class BlogService {
  constructor(
    private http: HttpClient
  ) {}

  fetchInfo(blogName: string, apiKey: string): Observable<InfoResponse> {
    const url = `https://api.tumblr.com/v2/blog/${blogName}/info?api_key=${apiKey}`;
    return this.http.get<InfoResponse>(url);
  }

  // Tumblr API restricts us to 20 posts per request.
  fetchPosts(blogName: string, apiKey: string, start: number, end: number, type = ''): Observable<Post[]> {
    // Build base URL
    let baseUrl = `https://api.tumblr.com/v2/blog/${blogName}/posts`;
    if (type) {
      baseUrl += `/${type}`;
    }
    baseUrl += `?api_key=${apiKey}`;

    // Break down requests into multiple windows.
    const windowSize = 20;
    // Full windows.
    const fullWindowCount = Math.floor((end - start) / windowSize);
    const pairs: number[][] = [];
    for (let i = 0; i < fullWindowCount; i++) {
      const _start = start + i * windowSize;
      const _end = _start + windowSize;
      const pair = [_start, _end];
      pairs.push(pair);
    }
    // One partial window?
    const partialWindowSize = (end - start) % windowSize;
    if (partialWindowSize > 0) {
      const _start = start + fullWindowCount * windowSize;
      const _end = _start + partialWindowSize;
      pairs.push([_start, _end]);
    }

    // Make multiple requests to Tumblr.
    const requests = pairs.map((pair) => {
      const _start = pair[0];
      const _end = pair[1];
      return this.http.get<PostsResponse>(`${baseUrl}&offset=${_start}&limit=${_end - _start}`).pipe(
        map<PostsResponse, Post[]>((postsResponse) => {
          return postsResponse.response.posts.map((post) => this._sanitizePost(post));
        })
      );
    });
    return Observable.forkJoin(...requests).pipe(
      map<Post[][], Post[]>((posts) => {
        return [].concat(...posts) as Post[];
      })
    );
  }

  private _sanitizePost(post: TumblrPost): Post {
    return <Post> {
      id: `${post.id}`,
      date: post.date,
      link: `https://${post.blog_name}.tumblr.com/post/${post.id}`,
      notes: post.note_count,
      type: post.type,
      // Use smallest version of first image in the post.
      imagePreviewUrl: (
        post.photos &&
        post.photos[0] &&
        post.photos[0].alt_sizes &&
        post.photos[0].alt_sizes[post.photos[0].alt_sizes.length - 1] &&
        post.photos[0].alt_sizes[post.photos[0].alt_sizes.length - 1].url ||
        null
      ),
      imageUrl: (
        post.photos &&
        post.photos[0] &&
        post.photos[0].original_size &&
        post.photos[0].original_size.url ||
        null
      ),
      videoPreviewUrl: post.thumbnail_url || null,
      videoUrl: post.video_url || null
    }
  }
}
