import {TextBoxInputField} from '../../../../shared/components/dynamic-form/input/textbox/text-box-input-field';
import {Validators} from '@angular/forms';

export const CHANGE_PASSWORD_FORM_KEYS = {
  currentPassword: 'currentPassword',
  newPassword: 'newPassword',
  confirmPassword: 'confirmPassword',
};

export const CHANGE_PASSWORD_FORM = [
  new TextBoxInputField({
    id: 'change-password-current',
    key: CHANGE_PASSWORD_FORM_KEYS.currentPassword,
    type: 'password',
    label: 'Current Password',
    placeholder: '••••',
    validators: [Validators.required]
  }),
  new TextBoxInputField({
    id: 'change-password-new',
    key: CHANGE_PASSWORD_FORM_KEYS.newPassword,
    type: 'password',
    label: 'New Password',
    placeholder: '••••',
    validators: [Validators.required, Validators.minLength(4)]
  }),
  new TextBoxInputField({
    id: 'change-password-confirm',
    key: CHANGE_PASSWORD_FORM_KEYS.confirmPassword,
    type: 'password',
    label: 'Confirm Password',
    placeholder: '••••',
    validators: [Validators.required, Validators.minLength(4)]
  })
];
