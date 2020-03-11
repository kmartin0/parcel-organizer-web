import {BaseInputField} from '../../base-input-field';

export class TextBoxInputField extends BaseInputField<string>{
  controlType = 'textbox';

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
