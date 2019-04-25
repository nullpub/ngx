import { Component } from '@angular/core';
import { AsyncData, failure, pending, success } from '@nll/dux';
import { none, Option, some } from 'fp-ts/lib/Option';

const genRandomAsyncData = () => {
  const asyncCase = Math.floor(Math.random() * 1000) % 3;
  const refreshing = !!(Math.floor(Math.random() * 1000) % 2);

  switch (asyncCase) {
    case 0:
      return pending();
    case 1:
      return failure(new Error('Generated Error'), refreshing);
    case 2:
    default:
      return success('Success Data', refreshing);
  }
};

const genRandomOption = () => {
  const optionCase = Math.floor(Math.random() * 1000) % 2;
  const data = Math.floor(Math.random() * 1000);

  switch (optionCase) {
    case 0:
      return none;
    case 1:
    default:
      return some(data);
  }
};

@Component({
  selector: 'app-root',
  template: `
    <div>
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

  constructor() {
    setInterval(() => (this.asyncData = genRandomAsyncData()), 1 * 1000);
    setInterval(() => (this.option = genRandomOption()), 1 * 700);
  }
}
