import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IoFormModule, NllAsyncDataModule, NllOptionModule } from 'projects/ngx/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,

    NllAsyncDataModule,
    NllOptionModule,
    IoFormModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
