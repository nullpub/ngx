import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { none, Option } from 'fp-ts/lib/Option';

interface OptionCaseView {
  viewContainerRef: ViewContainerRef;
  templateRef: TemplateRef<Object>;
}

@Directive({
  selector: '[nllOption]',
})
export class OptionDirective {
  option: Option<any> = none;

  noneCaseView?: OptionCaseView;
  someCaseView?: OptionCaseView;

  currentCaseView?: OptionCaseView;

  @Input()
  set nllOption(option: Option<any>) {
    this.option = option;

    if (option.isNone()) {
      this.setCaseView(this.noneCaseView);
    }

    if (option.isSome()) {
      this.setCaseView(this.someCaseView, {
        $implicit: option.value,
      });
    }
  }

  registerNone = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => (this.noneCaseView = { viewContainerRef, templateRef });
  registerSome = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => (this.someCaseView = { viewContainerRef, templateRef });

  /**
   * This is a naive, always update on changes solution. Ideally, we
   * would update the context for the current caseView if it is the same
   * case, instead of clearing and rerendering. However, EmbeddedViewRef
   * has context set as readonly. Which is weird considering:
   *
   * https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_for_of.ts#L240
   */
  setCaseView = (caseView?: OptionCaseView, context?: any) => {
    if (this.currentCaseView !== undefined) {
      this.removeCaseView(this.currentCaseView);
    }

    if (caseView !== undefined) {
      this.createCaseView(caseView, context);
    }

    this.currentCaseView = caseView;
  };

  createCaseView = (caseView: OptionCaseView, context?: any) => {
    caseView.viewContainerRef.createEmbeddedView(caseView.templateRef, context);
  };

  removeCaseView = (caseView: OptionCaseView) =>
    caseView.viewContainerRef.clear();
}
