import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EnumType, OptionFromOptionalType } from '@nll/utils-ts/lib/io';
import * as t from 'io-ts';
import { DateFromISOStringType, OptionFromNullableType } from 'io-ts-types';

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

@Injectable()
export class IoFormService {
  isContainer(io: any): io is Container {
    return (
      io && io._tag && (io._tag === 'ArrayType' || io._tag === 'InterfaceType')
    );
  }

  ioToForm(io: IO): FormControl | FormGroup | FormArray {
    switch (io._tag) {
      case 'BooleanType':
      case 'NumberType':
      case 'StringType':
      case 'EnumType':
      case 'DateFromISOStringType':
        return this.fb.control(undefined);
      case 'ArrayType':
        return this.fb.array([]);
      case 'OptionFromOptionalType':
      case 'OptionFromNullableType':
        // Unwrap Option types
        return this.ioToForm(io.type);
      case 'InterfaceType':
        let group = {};
        for (let k in io.props) {
          group[k] = this.ioToForm(io.props[k]);
        }
        return this.fb.group(group);
      default:
        // Warn and default to FormControl for things we don't understand.
        console.warn(UNKNOWN_TYPE_WARNING, io);
        return this.fb.control(undefined);
    }
  }

  constructor(readonly fb: FormBuilder) {}
}
