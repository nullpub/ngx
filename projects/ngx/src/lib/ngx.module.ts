import { NgModule } from '@angular/core';

import { AsyncDataDirective } from './async-data.directive';
import { AsyncFailureDirective } from './async-failure.directive';
import { AsyncPendingDirective } from './async-pending.directive';
import { AsyncSuccessDirective } from './async-success.directive';
import { NoneDirective } from './none.directive';
import { OptionDirective } from './option.directive';
import { SomeDirective } from './some.directive';

const DIRECTIVES = [
  AsyncDataDirective,
  AsyncPendingDirective,
  AsyncFailureDirective,
  AsyncSuccessDirective,

  OptionDirective,
  NoneDirective,
  SomeDirective,
];

@NgModule({
  declarations: DIRECTIVES,
  imports: [],
  exports: DIRECTIVES,
})
export class NgxModule {}
