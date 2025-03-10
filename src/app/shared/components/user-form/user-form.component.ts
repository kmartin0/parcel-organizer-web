import {Component} from '@angular/core';
import {USER_FORM, USER_FORM_KEYS} from './user.form';
import {passwordMatchValidator} from '../../validators/password-match.validator';
import {User} from '../../models/user';
import {isApiErrorBody} from '../../models/api-error-body';
import {ApiErrorEnum} from '../../../api/api-error.enum';
import {BaseFormComponent} from '../dynamic-form/base-form.component';
import {ValidatorFn} from '@angular/forms';
import {FormComponent} from '../dynamic-form/form/form.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [
    FormComponent
  ],
  standalone: true
})
export class UserFormComponent extends BaseFormComponent<User> {

  get form() {
    return USER_FORM;
  }

  override get formValidators(): ValidatorFn[] {
    return [passwordMatchValidator(USER_FORM_KEYS.password, USER_FORM_KEYS.confirmPassword, 'confirmPassword')];
  }

  constructor() {
    super();
  }

  handleApiError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      switch (apiError.error) {
        case  ApiErrorEnum.ALREADY_EXISTS : {
          if (apiError.details) this.formComponent.setError(USER_FORM_KEYS.email, apiError.details[USER_FORM_KEYS.email]);
          break;
        }
        case ApiErrorEnum.INVALID_ARGUMENTS: {
          if (apiError.details) {
            this.formComponent.setError(USER_FORM_KEYS.email, apiError.details[USER_FORM_KEYS.email]);
            this.formComponent.setError(USER_FORM_KEYS.password, apiError.details[USER_FORM_KEYS.password]);
            this.formComponent.setError(USER_FORM_KEYS.name, apiError.details[USER_FORM_KEYS.name]);
          }
          break;
        }
        case ApiErrorEnum.PERMISSION_DENIED: {
          this.formComponent.setError(USER_FORM_KEYS.password, 'Incorrect password.');
        }
      }
    } else {
      this.formComponent.setError(null, 'An unknown error has occurred.');
    }
  }

  onValidForm(formValues: { [key: string]: string }) {
    const user: User = {
      email: formValues[USER_FORM_KEYS.email],
      id: undefined,
      name: formValues[USER_FORM_KEYS.name],
      password: formValues[USER_FORM_KEYS.password],
      confirmPassword: formValues[USER_FORM_KEYS.confirmPassword]
    };

    this.validFormResult$.emit(user);
  }
}
