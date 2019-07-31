import { NgModule } from '@angular/core';

import { AsyncDataDirective } from './async-data.directive';
import { AsyncFailureDirective } from './async-failure.directive';
import { AsyncInitialDirective } from './async-initial.directive';
import { AsyncPendingDirective } from './async-pending.directive';
import { AsyncSuccessDirective } from './async-success.directive';

const DIRECTIVES = [
  AsyncDataDirective,
  AsyncInitialDirective,
  AsyncPendingDirective,
  AsyncFailureDirective,
  AsyncSuccessDirective,
];

@NgModule({
  declarations: DIRECTIVES,
  imports: [],
  exports: DIRECTIVES,
})
export class NllAsyncDataModule {}
