import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Datum, getEq, initial, isInitial, isPending, isRefresh, isReplete } from '@nll/datum/lib/Datum';
import { Eq } from 'fp-ts/lib/Eq';
import { fold, fromNullable } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

interface DatumCaseView {
  viewContainerRef: ViewContainerRef;
  templateRef: TemplateRef<Object>;
}

const objEq: Eq<unknown> = {
  equals: (a, b) => a === b,
};
const datumEq = getEq(objEq);

@Directive({
  selector: '[nllDatum]',
})
export class DatumDirective {
  private datum: Datum<unknown> = initial;

  initialCases: DatumCaseView[] = [];
  pendingCases: DatumCaseView[] = [];
  refreshCases: DatumCaseView[] = [];
  repleteCases: DatumCaseView[] = [];

  mountedCases: DatumCaseView[] = [];

  @Input()
  set nllDatum(datum: Datum<unknown>) {
    // If new and old ADT are different, unmount previous viewRefs
    if (!datumEq.equals(datum, this.datum)) {
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
      const context = {
        $implicit: datum.value,
        refreshing: true,
      };
      this.refreshCases.forEach(cv => this.ensureCaseView(cv, context));
      this.mountedCases = this.refreshCases;
    }

    if (isReplete(datum)) {
      const context = {
        $implicit: datum.value,
        refreshing: false,
      };
      this.repleteCases.forEach(cv => this.ensureCaseView(cv, context));
      this.mountedCases = this.repleteCases;
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
  registerRefresh = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => this.refreshCases.push({ viewContainerRef, templateRef });
  registerReplete = (
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Object>
  ) => this.repleteCases.push({ viewContainerRef, templateRef });

  ensureCaseView = (caseView: DatumCaseView, context?: any) => {
    pipe(
      fromNullable(<EmbeddedViewRef<any>>caseView.viewContainerRef.get(0)),
      fold(
        () => this.createCaseView(caseView, context),
        vr => this.updateViewRef(vr, context)
      )
    );
  };

  createCaseView = (caseView: DatumCaseView, context?: any) => {
    caseView.viewContainerRef.createEmbeddedView(caseView.templateRef, context);
  };

  removeCaseView = (caseView: DatumCaseView) =>
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
