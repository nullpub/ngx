import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { EitherDirective } from './either.directive';

@Directive({
  selector: '[nllRight]',
})
export class RightDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly eitherDirective?: EitherDirective
  ) {
    if (!!eitherDirective) {
      eitherDirective.registerRight(viewContainer, templateRef);
    } else {
      console.warn(
        'RightDirective: Could not find host nllEither to register with.'
      );
    }
  }
}
