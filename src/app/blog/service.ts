import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { InfoResponse, PostsResponse } from '../tumblr';

@Injectable()
export class BlogService {
  constructor(
    private http: HttpClient
  ) {}

  fetchInfo(blogName: string, apiKey: string): Observable<InfoResponse> {
    const url = `https://api.tumblr.com/v2/blog/${blogName}/info?api_key=${apiKey}`;
    return this.http.get<InfoResponse>(url);
  }

  fetchPosts(blogName: string, apiKey: string, offset: number): Observable<PostsResponse> {
    const url = `https://api.tumblr.com/v2/blog/${blogName}/posts?api_key=${apiKey}&offset=${offset}`;
    return this.http.get<PostsResponse>(url);
  }
}
