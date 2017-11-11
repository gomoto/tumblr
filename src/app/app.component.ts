import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tumblrForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.tumblrForm = this.formBuilder.group({
      blog: this.formBuilder.control('')
    });
  }
}
