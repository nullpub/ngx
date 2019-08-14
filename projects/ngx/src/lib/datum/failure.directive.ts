import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { DatumEitherDirective } from './datum-either.directive';

@Directive({
  selector: '[nllFailure]',
})
export class FailureDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly datumEitherDirective: DatumEitherDirective
  ) {
    if (!!datumEitherDirective) {
      datumEitherDirective.registerFailure(viewContainer, templateRef);
    } else {
      console.warn(
        'FailureDirective instantiated without parent DatumEitherDirective'
      );
    }
  }
}
