import {Component, Input} from '@angular/core';
import {isApiErrorBody} from '../../models/api-error-body';
import {ApiErrorEnum} from '../../../api/api-error.enum';
import {USER_AUTH_FORM, USER_AUTH_FORM_KEYS} from './user-auth.form';
import {UserAuthentication} from '../../models/user-authentication';
import {BaseFormComponent} from '../dynamic-form/base-form.component';

@Component({
  selector: 'app-user-auth-form',
  templateUrl: './user-auth-form.component.html',
  styleUrls: ['./user-auth-form.component.scss']
})
export class UserAuthFormComponent extends BaseFormComponent<UserAuthentication> {

  @Input() confirmButtonWidth = '50%';

  constructor() {
    super();
    this.formAction = 'Login';
  }

  get form() {
    return USER_AUTH_FORM;
  }

  handleApiError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      if (apiError.error === ApiErrorEnum.invalid_grant) {
        this.formComponent.setError(null, 'Username/password incorrect.');
      }
    } else {
      this.formComponent.setError(null, 'An unknown error has occurred.');
    }
  }

  onValidForm(formValues: { [key: string]: string }) {
    const userAuthentication: UserAuthentication = {
      email: formValues[USER_AUTH_FORM_KEYS.email],
      password: formValues[USER_AUTH_FORM_KEYS.password]
    };

    this.validFormResult$.emit(userAuthentication);
  }

}
