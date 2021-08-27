import {BaseInputField, InputFieldEnum} from '../../base-input-field';

export class DropdownInputField extends BaseInputField {
  options: { label: string, value: string }[];
  inputFieldEnum = InputFieldEnum.DROPDOWN_INPUT;

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || '';
  }
}
