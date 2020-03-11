import {BaseInputField} from '../../base-input-field';

export class DropdownInputField extends BaseInputField<string>{
  controlType = 'dropdown';
  options: {label: string, value: string}[];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || '';
  }
}
