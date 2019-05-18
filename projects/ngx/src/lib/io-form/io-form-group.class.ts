import { FormGroup } from '@angular/forms';

export class IoFormGroup extends FormGroup {
  // Extend patchValue to safe things up
  patchValue(
    value: unknown,
    options: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ): void {
    if (typeof value === 'object' && value !== null) {
      super.patchValue(value, options);
    }
  }
}
