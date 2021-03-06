import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { fold, fromNullable, isNone, isSome, none, Option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

interface OptionCaseView {
  viewContainerRef: ViewContainerRef;
  templateRef: TemplateRef<Object>;
}

@Directive({
  selector: '[nllOption]',
})
export class OptionDirective {
  option: Option<any> = none;

  noneCases: OptionCaseView[] = [];
  someCases: OptionCaseView[] = [];

  mountedCases: OptionCaseView[] = [];

  @Input()
  set nllOption(option: Option<any>) {
    if (this.option._tag !== option._tag) {
      this.mountedCases.forEach(this.removeCaseView);
    }

    this.option = option;

    if (isNone(option)) {
      this.noneCases.forEach(this.ensureCaseView);
      this.mountedCases = this.noneCases;
    }

    if (isSome(option)) {
      const context = {
        $implicit: option.value,
      };
      this.someCases.forEach(cv => this.ensureCaseView(cv, context));
      this.mountedCases = this.someCases;
    }
  }

  registerNone = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => this.noneCases.push({ viewContainerRef, templateRef });
  registerSome = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => this.someCases.push({ viewContainerRef, templateRef });

  ensureCaseView = (caseView: OptionCaseView, context?: any) => {
    pipe(
      fromNullable(<EmbeddedViewRef<any>>caseView.viewContainerRef.get(0)),
      fold(
        () => this.createCaseView(caseView, context),
        vr => this.updateViewRef(vr, context)
      )
    );
  };

  createCaseView = (caseView: OptionCaseView, context?: any) => {
    caseView.viewContainerRef.createEmbeddedView(caseView.templateRef, context);
  };

  removeCaseView = (caseView: OptionCaseView) =>
    caseView.viewContainerRef.clear();

  updateViewRef = (viewRef: EmbeddedViewRef<any>, context?: any) => {
    if (context) {
      Object.keys(context).forEach(key => {
        viewRef.context[key] = context[key];
      });
      viewRef.detectChanges();
    }
  };
}
