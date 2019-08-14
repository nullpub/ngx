import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { DatumEitherDirective } from './datum-either.directive';
import { DatumDirective } from './datum.directive';

@Directive({
  selector: '[nllPending]',
})
export class PendingDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly datumEitherDirective: DatumEitherDirective,
    @Optional() @Host() readonly datumDirective: DatumDirective
  ) {
    if (!!datumEitherDirective) {
      datumEitherDirective.registerPending(viewContainer, templateRef);
    } else if (!!datumDirective) {
      datumDirective.registerPending(viewContainer, templateRef);
    } else {
      console.warn(
        'PendingDirective instantiated without parent DatumDirective or DatumEitherDirective'
      );
    }
  }
}
