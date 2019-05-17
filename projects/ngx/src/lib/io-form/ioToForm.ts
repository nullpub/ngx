import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { EnumType, OptionFromOptionalType } from '@nll/utils-ts/lib/io';
import * as t from 'io-ts';
import { DateFromISOStringType, OptionFromNullableType } from 'io-ts-types';

import { IoFormArray } from './io-form-array.class';

export type Control =
  | t.StringType
  | t.NumberType
  | t.BooleanType
  | EnumType<any>
  | DateFromISOStringType;

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

export const ioToForm = (io: IO): FormGroup | IoFormArray | FormControl => {
  switch (io._tag) {
    // FormControls
    case 'BooleanType':
    case 'NumberType':
    case 'StringType':
    case 'EnumType':
    case 'DateFromISOStringType':
      return new FormControl();

    // FormGroups
    case 'InterfaceType':
      let group = {};
      for (let k in io.props) {
        group[k] = this.ioToForm(io.props[k]);
      }
      return new FormGroup(group);

    // FormArrays
    case 'ArrayType':
      const generateControl = () => this.ioToForm(io.type);
      return new IoFormArray([], undefined, undefined, generateControl);

    // Special Case: Unwrap Options
    case 'OptionFromOptionalType':
    case 'OptionFromNullableType':
      // Unwrap Option types
      return this.ioToForm(io.type);

    // Default to FormControl for unknown types
    default:
      // Warn and default to FormControl for things we don't understand.
      console.warn(UNKNOWN_TYPE_WARNING, io);
      return new FormControl();
  }
};
