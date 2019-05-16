import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Either } from 'fp-ts/lib/Either';

interface EitherCaseView {
  viewContainerRef: ViewContainerRef;
  templateRef: TemplateRef<Object>;
}

@Directive({
  selector: '[nllEither]',
})
export class EitherDirective {
  either!: Either<any, any>;

  leftCaseView?: EitherCaseView;
  rightCaseView?: EitherCaseView;

  currentCaseView?: EitherCaseView;

  @Input()
  set nllEither(either: Either<any, any>) {
    this.either = either;

    if (either.isLeft()) {
      this.setCaseView(this.leftCaseView);
    }

    if (either.isRight()) {
      this.setCaseView(this.rightCaseView, {
        $implicit: either.value,
      });
    }
  }

  registerLeft = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => (this.leftCaseView = { viewContainerRef, templateRef });

  registerRight = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => (this.rightCaseView = { viewContainerRef, templateRef });

  /**
   * This is a naive, always update on changes solution. Ideally, we
   * would update the context for the current caseView if it is the same
   * case, instead of clearing and rerendering. However, EmbeddedViewRef
   * has context set as readonly. Which is weird considering:
   *
   * https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_for_of.ts#L240
   */
  setCaseView = (caseView?: EitherCaseView, context?: any) => {
    if (this.currentCaseView !== undefined) {
      this.removeCaseView(this.currentCaseView);
    }

    if (caseView !== undefined) {
      this.createCaseView(caseView, context);
    }

    this.currentCaseView = caseView;
  };

  createCaseView = (caseView: EitherCaseView, context?: any) => {
    caseView.viewContainerRef.createEmbeddedView(caseView.templateRef, context);
  };

  removeCaseView = (caseView: EitherCaseView) =>
    caseView.viewContainerRef.clear();
}
