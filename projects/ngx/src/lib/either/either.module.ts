import { NgModule } from '@angular/core';

import { EitherDirective } from './either.directive';
import { LeftDirective } from './left.directive';
import { RightDirective } from './right.directive';

const DIRECTIVES = [EitherDirective, LeftDirective, RightDirective];

@NgModule({
  declarations: DIRECTIVES,
  imports: [],
  exports: DIRECTIVES,
})
export class NllEitherModule {}
