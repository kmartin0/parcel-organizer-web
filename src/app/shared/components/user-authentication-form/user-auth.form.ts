import {TextBoxInputField} from '../dynamic-form/input/textbox/text-box-input-field';
import {Validators} from '@angular/forms';

export const USER_AUTH_FORM_KEYS = {
  email: 'email',
  password: 'password'
};

export const USER_AUTH_FORM: TextBoxInputField[] = [
  new TextBoxInputField({
    id: 'user-authentication-form-email',
    key: USER_AUTH_FORM_KEYS.email,
    type: 'email',
    label: 'Email',
    placeholder: 'xyz@gmail.com',
    validators: [Validators.required, Validators.email]
  }),
  new TextBoxInputField({
    id: 'user-authentication-form-password',
    key: USER_AUTH_FORM_KEYS.password,
    type: 'password',
    label: 'Password',
    placeholder: '\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf',
    validators: Validators.required
  })
];


