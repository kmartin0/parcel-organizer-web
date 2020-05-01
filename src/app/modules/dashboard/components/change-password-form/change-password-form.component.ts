import {Component} from '@angular/core';
import {CHANGE_PASSWORD_FORM, CHANGE_PASSWORD_FORM_KEYS} from './change-password-form';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {ChangePassword} from '../../../../shared/models/change-password';
import {passwordMatchValidator} from '../../../../shared/validators/password-match.validator';
import {BaseFormComponent} from '../../../../shared/components/dynamic-form/base-form.component';
import {ValidatorFn} from '@angular/forms';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent extends BaseFormComponent<ChangePassword> {

  constructor() {
    super();
  }

  get form() {
    return CHANGE_PASSWORD_FORM;
  }

  get formValidators(): ValidatorFn[] {
    return [passwordMatchValidator(CHANGE_PASSWORD_FORM_KEYS.newPassword, CHANGE_PASSWORD_FORM_KEYS.confirmPassword, 'confirmPassword')];
  }

  handleApiError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      switch (apiError.error) {
        case ApiErrorEnum.INVALID_ARGUMENTS: {
          this.formComponent.setError(CHANGE_PASSWORD_FORM_KEYS.newPassword, apiError.details[CHANGE_PASSWORD_FORM_KEYS.newPassword]);
          this.formComponent.setError(CHANGE_PASSWORD_FORM_KEYS.currentPassword, apiError.details[CHANGE_PASSWORD_FORM_KEYS.currentPassword]);
          break;
        }
        case ApiErrorEnum.PERMISSION_DENIED: {
          this.formComponent.setError(CHANGE_PASSWORD_FORM_KEYS.currentPassword, 'Incorrect password');
        }
      }
    } else {
      this.formComponent.setError(null, 'An unknown error has occurred.');
    }
  }

  onValidForm(formValues: { [key: string]: string }) {
    const changePassword = new class implements ChangePassword {
      confirmPassword: string = formValues[CHANGE_PASSWORD_FORM_KEYS.confirmPassword];
      currentPassword: string = formValues[CHANGE_PASSWORD_FORM_KEYS.currentPassword];
      newPassword: string = formValues[CHANGE_PASSWORD_FORM_KEYS.newPassword];
    };
    this.validFormResult$.emit(changePassword);
  }
}
