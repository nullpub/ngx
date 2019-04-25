import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { AsyncDataDirective } from './async-data.directive';

@Directive({
  selector: '[nllAsyncFailure]',
})
export class AsyncFailureDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly asyncDataDirective: AsyncDataDirective
  ) {
    if (!!asyncDataDirective) {
      asyncDataDirective.registerFailure(viewContainer, templateRef);
    }
  }
}
