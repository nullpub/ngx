import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { AsyncDataDirective } from './async-data.directive';

@Directive({
  selector: '[nllAsyncPending]',
})
export class AsyncPendingDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly asyncDataDirective: AsyncDataDirective
  ) {
    if (!!asyncDataDirective) {
      asyncDataDirective.registerPending(viewContainer, templateRef);
    }
  }
}
