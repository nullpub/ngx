import { Directive, Host, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { OptionDirective } from './option.directive';

@Directive({
  selector: '[nllNone]',
})
export class NoneDirective {
  constructor(
    readonly viewContainer: ViewContainerRef,
    readonly templateRef: TemplateRef<Object>,
    @Optional() @Host() readonly optionDirective?: OptionDirective
  ) {
    if (!!optionDirective) {
      optionDirective.registerNone(viewContainer, templateRef);
    }
  }
}
