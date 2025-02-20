import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../../shared/components/dynamic-form/base-form.component';
import {ResetPassword} from '../../../../shared/models/reset-password';
import {RESET_PASSWORD_FORM, RESET_PASSWORD_FORM_KEYS} from './reset-password-form';
import {ValidatorFn} from '@angular/forms';
import {passwordMatchValidator} from '../../../../shared/validators/password-match.validator';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
  imports: [
    FormComponent
  ],
  standalone: true
})
export class ResetPasswordFormComponent extends BaseFormComponent<ResetPassword> implements OnInit {

  constructor() {
    super();
    this.formAction = 'Confirm';
  }

  ngOnInit(): void {
  }

  get form() {
    return RESET_PASSWORD_FORM;
  }

  override get formValidators(): ValidatorFn[] {
    return [passwordMatchValidator(RESET_PASSWORD_FORM_KEYS.newPassword, RESET_PASSWORD_FORM_KEYS.confirmPassword, 'confirmPassword')];
  }

  handleApiError(errorMessage: string) {
    this.formComponent.setError(null, errorMessage);
  }

  onValidForm(formValues: { [key: string]: string }) {
    let resetPassword: ResetPassword = {
      newPassword: formValues[RESET_PASSWORD_FORM_KEYS.newPassword],
      confirmPassword: formValues[RESET_PASSWORD_FORM_KEYS.confirmPassword],
    };

    this.validFormResult$.emit(resetPassword);
  }

}
