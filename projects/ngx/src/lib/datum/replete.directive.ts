import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { DatumEitherDirective } from './datum-either.directive';
import { DatumDirective } from './datum.directive';

@Directive({
  selector: '[nllReplete]',
})
export class RepleteDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly datumDirective: DatumDirective
  ) {
    if (!!datumDirective) {
      datumDirective.registerReplete(viewContainer, templateRef);
    } else {
      console.warn(
        'RepleteDirective instantiated without parent DatumDirective'
      );
    }
  }
}
