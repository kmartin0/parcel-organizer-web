import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormComponent} from '../dynamic-form/form/form.component';
import {UserService} from '../../services/user.service';
import {Subject} from 'rxjs';
import {loadingIndicator} from '../../helpers/operators';
import {isApiErrorBody} from '../../models/api-error-body';
import {ApiErrorEnum} from '../../../api/api-error.enum';
import {LOGIN_FORM, LOGIN_FORM_KEYS} from './user-auth.form';
import {BaseInputField} from '../dynamic-form/base-input-field';
import {User} from '../../models/user';
import {UserAuthentication} from '../../models/user-authentication';

@Component({
  selector: 'app-user-auth-form',
  templateUrl: './user-auth-form.component.html',
  styleUrls: ['./user-auth-form.component.css']
})
export class UserAuthFormComponent {

  @Input() confirmButtonWidth = '50%';

  @Input() loading$: Subject<boolean>;
  @Output() userAuthResult = new EventEmitter<UserAuthentication>();


  loginForm: BaseInputField<any>[] = LOGIN_FORM;

  @ViewChild(FormComponent, {static: false}) private _formComponent: FormComponent;
  get formComponent(): FormComponent {
    return this._formComponent;
  }

  constructor() {
  }

  onLoginValidSubmit(formKeyValues: { [key: string]: string; }) {
    const userAuthentication = new class implements UserAuthentication {
      email: string = formKeyValues[LOGIN_FORM_KEYS.email];
      password: string = formKeyValues[LOGIN_FORM_KEYS.password];
    };

    this.userAuthResult.emit(userAuthentication);
  }

  displaySuccess(callback?: () => void) {
    this.formComponent.displaySuccess(() => {
      if (callback) {
        callback();
      }
    });
  }

  handleUserAuthApiError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      if (apiError.error === ApiErrorEnum.invalid_grant) {
        this.formComponent.setError(null, 'Username/password incorrect.');
      }
    } else {
      this.formComponent.setError(null, 'An unknown error has occurred.');
    }
  }

}
