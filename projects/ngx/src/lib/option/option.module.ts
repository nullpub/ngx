import { NgModule } from '@angular/core';

import { NoneDirective } from './none.directive';
import { OptionDirective } from './option.directive';
import { SomeDirective } from './some.directive';

const DIRECTIVES = [OptionDirective, NoneDirective, SomeDirective];

@NgModule({
  declarations: DIRECTIVES,
  imports: [],
  exports: DIRECTIVES,
})
export class NllOptionModule {}
