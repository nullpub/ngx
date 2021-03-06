import { Component } from '@angular/core';
import { DatumEither, success } from '@nll/datum/lib/DatumEither';
import { Either, right } from 'fp-ts/lib/Either';
import { none, Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import { ioToForm } from 'projects/ngx/src/lib/io-form';

import { genRandomDatumEither, genRandomOption } from './utils';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>IO Form Test</h1>

      <form [formGroup]="form" (submit)="handleSubmit(form.value)">
        <span>Foo:</span>
        <input formControlName="foo" />

        <span>Bar:</span>
        <input type="number" formControlName="bar" />

        <button>Submit</button>
      </form>

      <h1>DatumEither Test</h1>

      <div [nllDatumEither]="datumEither">
        <h2>This is inside the datumEither div</h2>

        <div *nllInitial>
          <h3>Initial</h3>
        </div>

        <div *nllPending>
          <h3>Pending</h3>
        </div>

        <div *nllFailure="let error; let refreshing = refreshing">
          <h3>Failure</h3>
          <p>Error: {{ error }}</p>
          <p>Refreshing: {{ refreshing | json }}</p>
        </div>

        <div *nllSuccess="let value; let refreshing = refreshing">
          <h3>Success 1</h3>
          <p>Value: {{ value }}</p>
          <p>Refreshing: {{ refreshing | json }}</p>
        </div>

        <div *nllSuccess="let value; let refreshing = refreshing">
          <h3>Success 2</h3>
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

  datumEither: DatumEither<Error, string> = success('Initial Success');
  option: Option<any> = none;

  output: Either<any, any> = right('initial');

  // IO type should generally come from backend.
  readonly io = t.intersection([
    t.interface({
      foo: t.string,
    }),
    t.partial({
      bar: t.number,
    }),
  ]);

  // This is all it takes to create an arbitrarily sized form
  readonly form = ioToForm(this.io);

  handleSubmit(value: any) {
    // Use the IO to validate the form as well.
    this.output = this.io.decode(value);
    console.log('handleSubmit', this.output);
  }

  constructor() {
    setInterval(() => (this.datumEither = genRandomDatumEither()), 1 * 1000);
    setInterval(() => (this.option = genRandomOption()), 1 * 700);
  }
}
