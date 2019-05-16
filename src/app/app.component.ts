import { Component } from '@angular/core';
import { AsyncData, pending } from '@nll/dux';
import { createOptionFromOptional, OptionFromOptionalType } from '@nll/utils-ts/lib/io';
import { Either, right } from 'fp-ts/lib/Either';
import { none, Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

import { IoFormService } from '../../projects/ngx/src/lib/io-form/io-form.service';
import { genRandomAsyncData, genRandomOption } from './utils';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>IO Form Test</h1>

      <form [formGroup]="form" (submit)="handleSubmit(form.value)">
        <button>Submit</button>
      </form>

      <h1>Async Data Test</h1>

      <div [nllAsyncData]="asyncData">
        <h2>This is inside the asyncData div</h2>

        <div *nllAsyncPending>
          <h3>Pending</h3>
        </div>

        <div *nllAsyncFailure="let error; let refreshing = refreshing">
          <h3>Failure</h3>
          <p>Error: {{ error }}</p>
          <p>Refreshing: {{ refreshing | json }}</p>
        </div>

        <div *nllAsyncSuccess="let value; let refreshing = refreshing">
          <h3>Success</h3>
          <p>Value: {{ value }}</p>
          <p>Refreshing: {{ refreshing | json }}</p>
        </div>
      </div>

      <h1>Option Test</h1>

      <div [nllOption]="option">
        <h2>This is inside the option div</h2>

        <div *nllNone>
          <h3>None</h3>
        </div>

        <div *nllSome="let value">
          <h3>Some</h3>
          <p>Value: {{ value }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'nll-ngx';

  asyncData: AsyncData<any, any> = pending();
  option: Option<any> = none;

  output: Either<any, any> = right('initial');

  // IO type should generally come from backend.
  readonly io = t.interface({
    foo: t.string,
    bar: createOptionFromOptional(t.number),
  });

  // This is all it takes to create an arbitrarily sized form
  readonly form = this.ioSvc.ioToForm(this.io);

  handleSubmit(value: any) {
    // Use the IO to validate the form as well.
    this.output = this.io.decode(value);
    console.log('handleSubmit', this.output);
  }

  constructor(readonly ioSvc: IoFormService) {
    setInterval(() => (this.asyncData = genRandomAsyncData()), 1 * 1000);
    setInterval(() => (this.option = genRandomOption()), 1 * 700);
  }
}
