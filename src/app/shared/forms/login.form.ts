import {TextBoxInputField} from '../components/dynamic-form/input/textbox/text-box-input-field';
import {Validators} from '@angular/forms';

export const LOGIN_FORM_KEYS = {
  email: 'email',
  password: 'password'
};

export const LOGIN_FORM: TextBoxInputField[] = [
  new TextBoxInputField({
    id: 'login-email',
    key: LOGIN_FORM_KEYS.email,
    type: 'email',
    label: 'Email',
    placeholder: 'xyz@gmail.com',
    validators: [Validators.required, Validators.email]
  }),
  new TextBoxInputField({
    id: 'login-password',
    key: LOGIN_FORM_KEYS.password,
    type: 'password',
    label: 'Password',
    placeholder: '\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf',
    validators: Validators.required
  })
];


