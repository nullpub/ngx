import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IoFormDirective } from './io-form.directive';
import { IoFormPipe } from './io-form.pipe';
import { IoFormService } from './io-form.service';

export const DECLARATIONS = [IoFormDirective, IoFormPipe];

@NgModule({
  declarations: [DECLARATIONS],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [DECLARATIONS],
  providers: [IoFormService],
})
export class NllIoFormModule {}
