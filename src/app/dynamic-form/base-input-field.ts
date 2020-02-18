import {ValidatorFn} from '@angular/forms';

export class BaseInputField<T> {
  id: string;
  key: string;
  value: T;
  placeholder;
  label: string;
  required: boolean;
  type: string;
  controlType: string;
  validators: ValidatorFn[];

  constructor(options: {
    id?: string, key?: string, value?: T, placeholder?: string, label?: string, required?: boolean, type?: string, controlType?: string, validators?: ValidatorFn[]
  } = {}) {
    this.id = options.id;
    this.value = options.value;
    this.placeholder = options.placeholder;
    this.key = options.key;
    this.label = options.label;
    this.required = options.required;
    this.type = options.type;
    this.controlType = options.controlType;
    this.validators = options.validators;
  }
}
