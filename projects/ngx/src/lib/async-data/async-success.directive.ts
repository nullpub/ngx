import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { AsyncDataDirective } from './async-data.directive';

@Directive({
  selector: '[nllAsyncSuccess]',
})
export class AsyncSuccessDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly asyncDataDirective?: AsyncDataDirective
  ) {
    if (!!asyncDataDirective) {
      asyncDataDirective.registerSuccess(viewContainer, templateRef);
    }
  }
}
