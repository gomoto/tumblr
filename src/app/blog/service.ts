import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Post } from './model';
import { InfoResponse, PostsResponse } from '../tumblr';

@Injectable()
export class BlogService {
  constructor(
    private http: HttpClient
  ) {}

  fetchPosts(blogName: string, apiKey: string, offset: number): Observable<PostsResponse> {
    const url = `https://api.tumblr.com/v2/blog/${blogName}/posts?api_key=${apiKey}&offset=${offset}`;
    return this.http.get<PostsResponse>(url);
  }
}
