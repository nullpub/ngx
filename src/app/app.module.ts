import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxModule } from 'projects/ngx/src/public-api';

import { AppComponent } from './app.component';
import { AsyncDataDirective } from './async-data.directive';

@NgModule({
  declarations: [AppComponent, AsyncDataDirective],
  imports: [BrowserModule, NgxModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
