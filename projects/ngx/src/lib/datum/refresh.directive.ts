import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { DatumEitherDirective } from './datum-either.directive';
import { DatumDirective } from './datum.directive';

@Directive({
  selector: '[nllRefresh]',
})
export class RefreshDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly datumDirective: DatumDirective
  ) {
    if (!!datumDirective) {
      datumDirective.registerRefresh(viewContainer, templateRef);
    } else {
      console.warn(
        'RefreshDirective instantiated without parent DatumDirective'
      );
    }
  }
}
