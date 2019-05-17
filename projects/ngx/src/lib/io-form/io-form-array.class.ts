import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  ValidatorFn,
} from '@angular/forms';

export class IoFormArray extends FormArray {
  constructor(
    controls: AbstractControl[],
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
    readonly generateControl: () => AbstractControl = () => new FormControl()
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  // An outside editable seed value
  seedValue?: any;
  seedValidators?: ValidatorFn | ValidatorFn[];
  seedAsyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];

  // Extend patchValue to autoGenerate controls
  patchValue(
    value: any[],
    options: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ): void {
    // Create enough controls to handle values
    for (let i = this.controls.length; i < value.length; i++) {
      this.pushControl();
    }

    // Let native patch do its work
    super.patchValue(value, options);
  }

  // Push a new control with seed value if it exists
  pushControl(): void {
    const control = this.generateControl();
    if (this.seedValue) {
      control.patchValue(this.seedValue);
    }
    if (this.seedValidators) {
      control.setValidators(this.seedValidators);
    }
    if (this.seedAsyncValidators) {
      control.setAsyncValidators(this.seedAsyncValidators);
    }
    this.push(control);
  }
}
