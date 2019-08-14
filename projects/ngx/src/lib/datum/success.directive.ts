import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { DatumEitherDirective } from './datum-either.directive';

@Directive({
  selector: '[nllSuccess]',
})
export class SuccessDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly datumEitherDirective: DatumEitherDirective
  ) {
    if (!!datumEitherDirective) {
      datumEitherDirective.registerSuccess(viewContainer, templateRef);
    } else {
      console.warn(
        'SuccessDirective instantiated without parent DatumEitherDirective'
      );
    }
  }
}
