import {TextBoxInputField} from '../dynamic-form/input/textbox/text-box-input-field';
import {Validators} from '@angular/forms';

export const USER_FORM_KEYS = {
  email: 'email',
  name: 'name',
  password: 'password',
  confirmPassword: 'confirmPassword'
};

export const USER_FORM: TextBoxInputField[] = [
  new TextBoxInputField({
    id: 'register-form-email',
    key: USER_FORM_KEYS.email,
    type: 'email',
    label: 'Email',
    placeholder: 'xyz@gmail.com',
    validators: [Validators.required, Validators.email, Validators.maxLength(45)]
  }),
  new TextBoxInputField({
    id: 'register-form-name',
    key: USER_FORM_KEYS.name,
    type: 'text',
    label: 'Name',
    placeholder: 'John Doe',
    validators: [Validators.required, Validators.maxLength(45)]
  }),
  new TextBoxInputField({
    id: 'register-form-password',
    key: USER_FORM_KEYS.password,
    type: 'password',
    label: 'Password',
    placeholder: '\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf',
    validators: [Validators.required, Validators.minLength(6), Validators.maxLength(45)]
  }),
  new TextBoxInputField({
    id: 'register-form-confirm-password',
    key: USER_FORM_KEYS.confirmPassword,
    type: 'password',
    label: 'Confirm Password',
    placeholder: '\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf',
    validators: [Validators.required, Validators.minLength(6), Validators.maxLength(45)]
  })
];
