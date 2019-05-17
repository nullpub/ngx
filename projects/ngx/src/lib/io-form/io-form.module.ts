import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IoFormPipe } from './io-form.pipe';

export const DECLARATIONS = [IoFormPipe];

@NgModule({
  declarations: [DECLARATIONS],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [DECLARATIONS],
  providers: [],
})
export class IoFormModule {}
