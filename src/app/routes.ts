import { Routes } from '@angular/router';
import { BlogForm } from './blog-form/blog-form';
import { BlogPage } from './blog-page/blog-page';

export const routes: Routes = [
  {
    path: '',
    component: BlogForm
  },
  {
    path: ':blogName',
    component: BlogPage
  }
  // {
  //   path: '**',
  //   component: NotFound404
  // }
];
