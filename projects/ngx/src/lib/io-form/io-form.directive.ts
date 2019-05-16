import { Directive, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { IoFormService } from './io-form.service';

@Directive({
  selector: '[nllIoForm]',
})
export class IoFormDirective {
  control?: FormGroup | FormArray | FormControl;
  errors: Error[] = [];

  @Input()
  set nllIoForm(io: any) {
    console.log('Got io', io);

    if (this.ioSvc.isContainer(io)) {
      const form = this.ioSvc.ioToForm(io);
      console.log('Made Form', form);
    }
  }

  constructor(readonly ioSvc: IoFormService) {}
}
