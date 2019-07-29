import { FormControl } from '@angular/forms';
import * as t from 'io-ts';

import { IoFormArray } from './io-form-array.class';
import { IoFormGroup } from './io-form-group.class';

export type Control =
  | t.StringType
  | t.NumberType
  | t.BooleanType
  | t.KeyofType<Record<string, unknown>>;

export type Intersection = t.IntersectionType<Group[]>;

export type Array = t.ArrayType<Control | Group>;

export type Group =
  | t.InterfaceType<{
      [key: string]: Control | Group | Array;
    }>
  | t.PartialType<{
      [key: string]: Control | Group | Array;
    }>;

export type Container = Intersection | Group | Array;

export type Codec = Container | Control;

const UNKNOWN_TYPE_WARNING =
  'IoFormService encountered an unknown type codec, defaulting to FormControl for type';

export const groupToForm = (
  group: Group,
  formGroup = new IoFormGroup({})
): IoFormGroup => {
  Object.keys(group.props).forEach(k =>
    formGroup.addControl(k, ioToForm(group.props[k]))
  );
  return formGroup;
};

export const ioToForm = (
  codec: Codec
): IoFormGroup | IoFormArray | FormControl => {
  switch (codec._tag) {
    // FormControls
    case 'BooleanType':
    case 'NumberType':
    case 'StringType':
    case 'KeyofType':
      return new FormControl();

    // IoFormGroup
    case 'InterfaceType':
    case 'PartialType':
      return groupToForm(codec);

    case 'IntersectionType':
      const formGroup = new IoFormGroup({});
      codec.types.forEach(c => groupToForm(c, formGroup)); // MUTABLE NONSENSE
      return formGroup;

    // IoFormArray
    case 'ArrayType':
      const generateControl = () => ioToForm(codec.type);
      return new IoFormArray([], undefined, undefined, generateControl);

    // Default to FormControl for unknown types
    default:
      // Warn and default to FormControl for things we don't understand.
      console.warn(UNKNOWN_TYPE_WARNING, codec);
      return new FormControl();
  }
};
