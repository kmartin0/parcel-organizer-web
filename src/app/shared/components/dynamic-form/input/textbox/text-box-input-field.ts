import {BaseInputField, InputFieldEnum} from '../../base-input-field';

export class TextBoxInputField extends BaseInputField {
  inputFieldEnum = InputFieldEnum.TEXT_BOX_INPUT;

  constructor(options: {} = {}) {
    super(options);
  }
}
