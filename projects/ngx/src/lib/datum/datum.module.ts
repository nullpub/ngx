import { NgModule } from '@angular/core';

import { DatumEitherDirective } from './datum-either.directive';
import { DatumDirective } from './datum.directive';
import { FailureDirective } from './failure.directive';
import { InitialDirective } from './initial.directive';
import { PendingDirective } from './pending.directive';
import { RefreshDirective } from './refresh.directive';
import { RepleteDirective } from './replete.directive';
import { SuccessDirective } from './success.directive';

const DIRECTIVES = [
  DatumDirective,
  DatumEitherDirective,
  InitialDirective,
  PendingDirective,
  RefreshDirective,
  RepleteDirective,
  FailureDirective,
  SuccessDirective,
];

@NgModule({
  declarations: DIRECTIVES,
  imports: [],
  exports: DIRECTIVES,
})
export class NllDatumModule {}
