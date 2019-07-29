import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AsyncData, pending } from '@nll/dux';
import { fold, fromNullable } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

interface AsyncCaseView {
  viewContainerRef: ViewContainerRef;
  templateRef: TemplateRef<Object>;
}

@Directive({
  selector: '[nllAsyncData]',
})
export class AsyncDataDirective {
  asyncData: AsyncData<any, any> = pending();

  pendingCases: AsyncCaseView[] = [];
  failureCases: AsyncCaseView[] = [];
  successCases: AsyncCaseView[] = [];

  mountedCases: AsyncCaseView[] = [];

  @Input()
  set nllAsyncData(asyncData: AsyncData<any, any>) {
    // If new and old ADT are different, unmount previous viewRefs
    if (asyncData._tag !== this.asyncData._tag) {
      this.mountedCases.forEach(this.removeCaseView);
    }

    if (asyncData.isPending()) {
      this.pendingCases.forEach(this.ensureCaseView);
      this.mountedCases = this.pendingCases;
    }

    if (asyncData.isFailure()) {
      const context = {
        $implicit: asyncData.error,
        refreshing: asyncData.refreshing,
      };
      this.failureCases.forEach(cv => this.ensureCaseView(cv, context));
      this.mountedCases = this.failureCases;
    }

    if (asyncData.isSuccess()) {
      const context = {
        $implicit: asyncData.value,
        refreshing: asyncData.refreshing,
      };
      this.successCases.forEach(cv => this.ensureCaseView(cv, context));
      this.mountedCases = this.successCases;
    }

    this.asyncData = asyncData;
  }

  registerPending = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => this.pendingCases.push({ viewContainerRef, templateRef });
  registerFailure = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => this.failureCases.push({ viewContainerRef, templateRef });
  registerSuccess = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => this.successCases.push({ viewContainerRef, templateRef });

  ensureCaseView = (caseView: AsyncCaseView, context?: any) => {
    pipe(
      fromNullable(<EmbeddedViewRef<any>>caseView.viewContainerRef.get(0)),
      fold(
        () => this.createCaseView(caseView, context),
        vr => this.updateViewRef(vr, context)
      )
    );
  };

  createCaseView = (caseView: AsyncCaseView, context?: any) => {
    caseView.viewContainerRef.createEmbeddedView(caseView.templateRef, context);
  };

  removeCaseView = (caseView: AsyncCaseView) =>
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
