import { FormControl } from '@angular/forms';
import { DateFromDatelikeType, EnumType, OptionFromOptionalType } from '@nll/utils-ts/lib/io';
import * as t from 'io-ts';
import { DateFromISOStringType, OptionFromNullableType } from 'io-ts-types';

import { IoFormArray } from './io-form-array.class';
import { IoFormGroup } from './io-form-group.class';

export type Control =
  | t.StringType
  | t.NumberType
  | t.BooleanType
  | t.KeyofType<Record<string, unknown>>
  | EnumType<any>
  | DateFromISOStringType
  | DateFromDatelikeType;

export type Array = t.ArrayType<Control | Group>;

export type Pass =
  | OptionFromNullableType<Control | Group | Array>
  | OptionFromOptionalType<Control | Group | Array>;

export type Group = t.InterfaceType<{
  [key: string]: Control | Group | Array | Pass;
}>;

export type IO = Control | Array | Pass | Group;
export type Container = Group | Array;

const UNKNOWN_TYPE_WARNING =
  'IoFormService encountered an unknown type codec, defaulting to FormControl for type';

export const ioToForm = (io: IO): IoFormGroup | IoFormArray | FormControl => {
  switch (io._tag) {
    // FormControls
    case 'BooleanType':
    case 'NumberType':
    case 'StringType':
    case 'EnumType':
    case 'DateFromISOStringType':
    case 'DateFromDatelikeType':
    case 'KeyofType':
      return new FormControl();

    // IoFormGroups
    case 'InterfaceType':
      let group = {};
      for (let k in io.props) {
        group[k] = ioToForm(io.props[k]);
      }
      return new IoFormGroup(group);

    // FormArrays
    case 'ArrayType':
      const generateControl = () => ioToForm(io.type);
      return new IoFormArray([], undefined, undefined, generateControl);

    // Special Case: Unwrap Options
    case 'OptionFromOptionalType':
    case 'OptionFromNullableType':
      // Unwrap Option types
      return ioToForm(io.type);

    // Default to FormControl for unknown types
    default:
      // Warn and default to FormControl for things we don't understand.
      console.warn(UNKNOWN_TYPE_WARNING, io);
      return new FormControl();
  }
};
