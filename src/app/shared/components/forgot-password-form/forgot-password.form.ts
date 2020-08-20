import {TextBoxInputField} from '../dynamic-form/input/textbox/text-box-input-field';
import {Validators} from '@angular/forms';

export const FORGOT_PASSWORD_FORM_KEYS = {
  email: 'email',
};

export const FORGOT_PASSWORD_FORM: TextBoxInputField[] = [
  new TextBoxInputField({
    id: 'forgot-password-form-email',
    key: FORGOT_PASSWORD_FORM_KEYS.email,
    type: 'email',
    label: 'Email',
    placeholder: 'xyz@gmail.com',
    validators: [Validators.required, Validators.email, Validators.maxLength(45)]
  })
];
