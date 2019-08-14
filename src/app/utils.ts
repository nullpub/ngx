import { datum, datumEither } from '@nll/datum';
import { left, right } from 'fp-ts/es6/Either';
import { none, some } from 'fp-ts/es6/Option';

export const genRandomDatumEither = (): datumEither.DatumEither<
  Error,
  string
> => {
  const asyncCase = Math.floor(Math.random() * 1000) % 6;
  const data = Math.floor(Math.random() * 1000) % 3;

  switch (asyncCase) {
    case 0:
      return datum.initial;
    case 1:
      return datum.pending;
    case 2:
      return datumEither.failure(new Error(`Generated Error ${data}`));
    case 3:
      return datumEither.success(`Success Data ${data}`);
    case 4:
      return datum.refresh(left(new Error(`Generated Error ${data}`)));
    case 5:
      return datum.refresh(right(`Success Data ${data}`));
    default:
      return datum.initial;
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
