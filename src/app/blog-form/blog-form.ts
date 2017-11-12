import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'blog-form',
  templateUrl: './blog-form.html',
  styleUrls: ['./blog-form.scss']
})
export class BlogForm {
  @ViewChild('blogInput') blogInput: ElementRef;

  tumblrForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.tumblrForm = this.formBuilder.group({
      blog: this.formBuilder.control('', Validators.required)
    });
  }

  ngAfterViewInit(): void {
    // Automatically focus on input.
    this.blogInput.nativeElement.focus();
  }

  public submitForm(): void {
    const blogName: string = this.tumblrForm.get('blog').value;
    this._goToBlog(blogName);
  }

  private _goToBlog(blogName: string): void {
    this.router.navigate([blogName]);
  }
}
