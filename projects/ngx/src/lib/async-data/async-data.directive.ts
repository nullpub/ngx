import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AsyncData, pending } from '@nll/dux';

interface AsyncCaseView {
  viewContainerRef: ViewContainerRef;
  templateRef: TemplateRef<Object>;
}

@Directive({
  selector: '[nllAsyncData]',
})
export class AsyncDataDirective {
  asyncData: AsyncData<any, any> = pending();

  pendingCaseView?: AsyncCaseView;
  failureCaseView?: AsyncCaseView;
  successCaseView?: AsyncCaseView;

  currentCaseView?: AsyncCaseView;

  @Input()
  set nllAsyncData(asyncData: AsyncData<any, any>) {
    this.asyncData = asyncData;

    if (asyncData.isPending()) {
      this.setCaseView(this.pendingCaseView);
    }

    if (asyncData.isFailure()) {
      this.setCaseView(this.failureCaseView, {
        $implicit: asyncData.error,
        refreshing: asyncData.refreshing,
      });
    }

    if (asyncData.isSuccess()) {
      this.setCaseView(this.successCaseView, {
        $implicit: asyncData.value,
        refreshing: asyncData.refreshing,
      });
    }
  }

  registerPending = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => (this.pendingCaseView = { viewContainerRef, templateRef });
  registerFailure = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => (this.failureCaseView = { viewContainerRef, templateRef });
  registerSuccess = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => (this.successCaseView = { viewContainerRef, templateRef });

  /**
   * This is a naive, always update on changes solution. Ideally, we
   * would update the context for the current caseView if it is the same
   * case, instead of clearing and rerendering. However, EmbeddedViewRef
   * has context set as readonly. Which is weird considering:
   *
   * https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_for_of.ts#L240
   *
   * Likely, this means we can't change the context reference but
   * we are allowed to change the context values and call checkForChanges
   */
  setCaseView = (caseView?: AsyncCaseView, context?: any) => {
    if (this.currentCaseView !== undefined) {
      this.removeCaseView(this.currentCaseView);
    }

    if (caseView !== undefined) {
      this.createCaseView(caseView, context);
    }

    this.currentCaseView = caseView;
  };

  createCaseView = (caseView: AsyncCaseView, context?: any) => {
    caseView.viewContainerRef.createEmbeddedView(caseView.templateRef, context);
  };

  removeCaseView = (caseView: AsyncCaseView) =>
    caseView.viewContainerRef.clear();
}
