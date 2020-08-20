import {TextBoxInputField} from '../../../../shared/components/dynamic-form/input/textbox/text-box-input-field';
import {Validators} from '@angular/forms';

export const RESET_PASSWORD_FORM_KEYS = {
  newPassword: 'newPassword',
  confirmPassword: 'confirmPassword'
};

export const RESET_PASSWORD_FORM: TextBoxInputField[] = [
  new TextBoxInputField({
    id: 'reset-password-new',
    key: RESET_PASSWORD_FORM_KEYS.newPassword,
    type: 'password',
    label: 'New Password',
    placeholder: '••••',
    validators: [Validators.required, Validators.minLength(4)]
  }),
  new TextBoxInputField({
    id: 'reset-password-confirm',
    key: RESET_PASSWORD_FORM_KEYS.confirmPassword,
    type: 'password',
    label: 'Confirm Password',
    placeholder: '••••',
    validators: [Validators.required, Validators.minLength(4)]
  })
];
