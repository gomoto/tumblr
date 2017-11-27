import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AppComponent } from './app.component';
import { BlogForm } from './blog-form/blog-form';
import { BlogPage } from './blog-page/blog-page';

import { reducers } from './reducers';
import { effects } from './effects';
import { routes } from './routes';
import { BlogService } from './blog';

@NgModule({
  declarations: [
    AppComponent,
    BlogForm,
    BlogPage
  ],
  imports: [
    BrowserModule,
    // HttpClientModule after BrowserModule
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      routes,
      { /* enableTracing: true */ } // <-- debugging purposes only
    ),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule
  ],
  providers: [
    BlogService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
