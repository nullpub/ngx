import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { getEq, initial, isInitial, isPending, isRefresh, isReplete } from '@nll/datum/lib/Datum';
import { DatumEither } from '@nll/datum/lib/DatumEither';
import { getEq as getEqEither, isLeft } from 'fp-ts/lib/Either';
import { Eq } from 'fp-ts/lib/Eq';
import { fold, fromNullable } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

interface DatumEitherCaseView {
  viewContainerRef: ViewContainerRef;
  templateRef: TemplateRef<Object>;
}

const objEq: Eq<unknown> = {
  equals: (a, b) => a === b,
};
const datumEitherEq = getEq(getEqEither(objEq, objEq));
const isNil = <T>(t: T | undefined | null): boolean =>
  t === null || t === undefined;

@Directive({
  selector: '[nllDatumEither]',
})
export class DatumEitherDirective {
  private datum: DatumEither<unknown, unknown> = initial;

  initialCases: DatumEitherCaseView[] = [];
  pendingCases: DatumEitherCaseView[] = [];
  failureCases: DatumEitherCaseView[] = [];
  successCases: DatumEitherCaseView[] = [];

  mountedCases: DatumEitherCaseView[] = [];

  @Input()
  set nllDatumEither(datum: DatumEither<unknown, unknown> | undefined | null) {
    if (isNil(datum)) {
      // Many common pipes will return null in awkward situations, cast to initial in those cases
      datum = initial;
    }

    // If new and old ADT are different, unmount previous viewRefs
    if (!datumEitherEq.equals(datum, this.datum)) {
      this.mountedCases.forEach(this.removeCaseView);
    }

    if (isInitial(datum)) {
      this.initialCases.forEach(this.ensureCaseView);
      this.mountedCases = this.initialCases;
    }

    if (isPending(datum)) {
      this.pendingCases.forEach(this.ensureCaseView);
      this.mountedCases = this.pendingCases;
    }

    if (isRefresh(datum)) {
      if (isLeft(datum.value)) {
        const context = {
          $implicit: datum.value.left,
          refreshing: true,
        };
        this.failureCases.forEach(cv => this.ensureCaseView(cv, context));
        this.mountedCases = this.failureCases;
      } else {
        const context = {
          $implicit: datum.value.right,
          refreshing: true,
        };
        this.successCases.forEach(cv => this.ensureCaseView(cv, context));
        this.mountedCases = this.successCases;
      }
    }

    if (isReplete(datum)) {
      if (isLeft(datum.value)) {
        const context = {
          $implicit: datum.value.left,
          refreshing: false,
        };
        this.failureCases.forEach(cv => this.ensureCaseView(cv, context));
        this.mountedCases = this.failureCases;
      } else {
        const context = {
          $implicit: datum.value.right,
          refreshing: false,
        };
        this.successCases.forEach(cv => this.ensureCaseView(cv, context));
        this.mountedCases = this.successCases;
      }
    }

    this.datum = datum;
  }

  registerInitial = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => this.initialCases.push({ viewContainerRef, templateRef });
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

  ensureCaseView = (caseView: DatumEitherCaseView, context?: any) => {
    pipe(
      fromNullable(<EmbeddedViewRef<any>>caseView.viewContainerRef.get(0)),
      fold(
        () => this.createCaseView(caseView, context),
        vr => this.updateViewRef(vr, context)
      )
    );
  };

  createCaseView = (caseView: DatumEitherCaseView, context?: any) => {
    caseView.viewContainerRef.createEmbeddedView(caseView.templateRef, context);
  };

  removeCaseView = (caseView: DatumEitherCaseView) =>
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
