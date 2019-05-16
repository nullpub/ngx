import { Pipe, PipeTransform } from '@angular/core';

import { IoFormService } from './io-form.service';

@Pipe({ name: 'ioToForm' })
export class IoFormPipe implements PipeTransform {
  transform(value: any): any {
    return this.ioSvc.ioToForm(value);
  }
  constructor(readonly ioSvc: IoFormService) {}
}
