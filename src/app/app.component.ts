import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as request from 'request';
import { InfoResponse } from './tumblr';

const apiKey = 'u9oKp2z6VfHuyX7mkfX40S2uSfjZpYSKc6EkMWo2F9SbVtM1hS';

interface Blog {
  name: string;
  postCount: number;
  posts: Post[];
}

interface Post {}

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
    const url = `https://api.tumblr.com/v2/blog/${this.blog.name}/posts?api_key=${apiKey}`;
    request(url, (error, response, body) => {
      const data: InfoResponse = JSON.parse(body);
      console.log(data);
    });
  }
}
