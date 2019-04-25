import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { OptionDirective } from './option.directive';

@Directive({
  selector: '[nllSome]',
})
export class SomeDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly optionDirective?: OptionDirective
  ) {
    if (!!optionDirective) {
      optionDirective.registerSome(viewContainer, templateRef);
    }
  }
}
