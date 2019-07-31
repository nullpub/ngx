import { failure, initial, pending, success } from '@nll/dux';
import { none, some } from 'fp-ts/lib/Option';

export const genRandomAsyncData = () => {
  const asyncCase = Math.floor(Math.random() * 1000) % 4;
  const refreshing = !!(Math.floor(Math.random() * 1000) % 2);
  const data = Math.floor(Math.random() * 1000) % 3;

  switch (asyncCase) {
    case 0:
      return initial();
    case 1:
      return pending();
    case 2:
      return failure(new Error(`Generated Error ${data}`), refreshing);
    case 3:
    default:
      return success(`Success Data ${data}`, refreshing);
  }
};

export const genRandomOption = () => {
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
