import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { EitherDirective } from './either.directive';

@Directive({
  selector: '[nllLeft]',
})
export class LeftDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly eitherDirective?: EitherDirective
  ) {
    if (!!eitherDirective) {
      eitherDirective.registerLeft(viewContainer, templateRef);
    } else {
      console.warn(
        'LeftDirective: Could not find host nllEither to register with.'
      );
    }
  }
}
