import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Either, isLeft, isRight } from 'fp-ts/es6/Either';
import { fold, fromNullable } from 'fp-ts/es6/Option';
import { pipe } from 'fp-ts/es6/pipeable';

interface EitherCaseView {
  viewContainerRef: ViewContainerRef;
  templateRef: TemplateRef<Object>;
}

@Directive({
  selector: '[nllEither]',
})
export class EitherDirective {
  either!: Either<any, any>;

  leftCases: EitherCaseView[] = [];
  rightCases: EitherCaseView[] = [];

  mountedCases?: EitherCaseView[] = [];

  @Input()
  set nllEither(either: Either<any, any>) {
    if (this.either._tag !== either._tag) {
      this.mountedCases.forEach(this.removeCaseView);
    }

    this.either = either;

    if (isLeft(either)) {
      this.leftCases.forEach(this.ensureCaseView);
      this.mountedCases = this.leftCases;
    }

    if (isRight(either)) {
      const context = {
        $implicit: either.right,
      };
      this.rightCases.forEach(cv => this.ensureCaseView(cv, context));
      this.mountedCases = this.rightCases;
    }
  }

  registerLeft = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => this.leftCases.push({ viewContainerRef, templateRef });

  registerRight = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => this.rightCases.push({ viewContainerRef, templateRef });

  ensureCaseView = (caseView: EitherCaseView, context?: any) => {
    pipe(
      fromNullable(<EmbeddedViewRef<any>>caseView.viewContainerRef.get(0)),
      fold(
        () => this.createCaseView(caseView, context),
        vr => this.updateViewRef(vr, context)
      )
    );
  };

  createCaseView = (caseView: EitherCaseView, context?: any) => {
    caseView.viewContainerRef.createEmbeddedView(caseView.templateRef, context);
  };

  removeCaseView = (caseView: EitherCaseView) =>
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
