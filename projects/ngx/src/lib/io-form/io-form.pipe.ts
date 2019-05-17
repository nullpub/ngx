import { Pipe, PipeTransform } from '@angular/core';

import { ioToForm } from './ioToForm';

@Pipe({ name: 'ioToForm' })
export class IoFormPipe implements PipeTransform {
  transform(value: any): any {
    return ioToForm(value);
  }
}
