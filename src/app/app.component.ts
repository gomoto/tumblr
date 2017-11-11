import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as request from 'request';
import { InfoResponse, PostsResponse } from './tumblr';

const apiKey = 'u9oKp2z6VfHuyX7mkfX40S2uSfjZpYSKc6EkMWo2F9SbVtM1hS';

interface Blog {
  name: string;
  postCount: number;
  posts: Post[];
}

interface Post {
  date: string;  // Date
  link: string;
  notes: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tumblrForm: FormGroup;
  blog: Blog | null;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.tumblrForm = this.formBuilder.group({
      blog: this.formBuilder.control('')
    });
    this.blog = null;
  }

  submitTumblrForm(): void {
    const blogControl = this.tumblrForm.get('blog') as FormControl;
    const blog = blogControl.value;
    const url = `https://api.tumblr.com/v2/blog/${blog}/info?api_key=${apiKey}`;
    request(url, (error, response, body) => {
      const data: InfoResponse = JSON.parse(body);
      const blog = data.response.blog;
      this.blog = {
        name: blog.name,
        postCount: blog.posts,
        posts: []
      };
    });
  }

  getPosts(): void {
    if (this.blog === null) {
      throw new Error('blog must be defined before getting posts');
    }
    const url = `https://api.tumblr.com/v2/blog/${this.blog.name}/posts?api_key=${apiKey}`;
    request(url, (error, response, body) => {
      const data: PostsResponse = JSON.parse(body);
      // Set blog posts.
      this.blog.posts = data.response.posts.map((post) => {
        return <Post> {
          date: post.date,
          link: `https://${post.blog_name}.tumblr.com/post/${post.id}`,
          notes: post.note_count
        };
      });
    });
  }
}
