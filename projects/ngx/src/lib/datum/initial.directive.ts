import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { DatumEitherDirective } from './datum-either.directive';
import { DatumDirective } from './datum.directive';

@Directive({
  selector: '[nllInitial]',
})
export class InitialDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly datumEitherDirective: DatumEitherDirective,
    @Optional() @Host() readonly datumDirective: DatumDirective
  ) {
    if (!!datumEitherDirective) {
      datumEitherDirective.registerInitial(viewContainer, templateRef);
    } else if (!!datumDirective) {
      datumDirective.registerInitial(viewContainer, templateRef);
    } else {
      console.warn(
        'InitialDirective instantiated without parent DatumDirective or DatumEitherDirective'
      );
    }
  }
}
