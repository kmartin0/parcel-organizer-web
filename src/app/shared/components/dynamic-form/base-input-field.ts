import {ValidatorFn} from '@angular/forms';

export abstract class BaseInputField {
  id: string;
  key: string;
  placeholder;
  label: string;
  type: string;
  value?: any;
  validators: ValidatorFn[];
  abstract inputFieldEnum: InputFieldEnum;

  protected constructor(options: {
    id?: string, key?: string, placeholder?: string, label?: string, type?: string, value?: any, validators?: ValidatorFn[]
  } = {}) {
    this.id = options.id;
    this.placeholder = options.placeholder;
    this.key = options.key;
    this.label = options.label;
    this.type = options.type;
    this.value = options.value;
    this.validators = options.validators;
  }

}

export enum InputFieldEnum {TEXT_BOX_INPUT = 'TEXT_BOX_INPUT', DROPDOWN_INPUT = 'DROPDOWN_INPUT'}
