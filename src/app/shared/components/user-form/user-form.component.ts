import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseInputField} from '../dynamic-form/base-input-field';
import {USER_FORM, USER_FORM_KEYS} from './user.form';
import {passwordMatchValidator} from '../../validators/password-match.validator';
import {Subject} from 'rxjs';
import {User} from '../../models/user';
import {Oauth2Credentials} from '../../models/oauth2-credentials';
import {isApiErrorBody} from '../../models/api-error-body';
import {ApiErrorEnum} from '../../../api/api-error.enum';
import {FormComponent} from '../dynamic-form/form/form.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Input() formAction: string;
  @Input() loading$: Subject<boolean>;
  @Output() userResult = new EventEmitter<User>();

  userForm: BaseInputField<any>[] = USER_FORM;
  userFormValidators = [passwordMatchValidator('password', 'confirmPassword', 'confirmPassword')];

  @ViewChild(FormComponent, {static: false}) private _formComponent: FormComponent;
  get formComponent(): FormComponent {
    return this._formComponent;
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  onFormValidSubmit(formValues: { [key: string]: string; }) {
    const user: User = new class implements User {
      email: string = formValues[USER_FORM_KEYS.email];
      id: string;
      name: string = formValues[USER_FORM_KEYS.name];
      oauth2Credentials: Oauth2Credentials;
      password: string = formValues[USER_FORM_KEYS.password];
      confirmPassword: string = formValues[USER_FORM_KEYS.confirmPassword]
    };

    this.userResult.emit(user);
  }

  displaySuccess(callback?: () => void) {
    this.formComponent.displaySuccess(() => {
      if (callback) {
        callback();
      }
    });
  }

  handleUserApiError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      switch (apiError.error) {
        case  ApiErrorEnum.ALREADY_EXISTS : {
          this.formComponent.setError(USER_FORM_KEYS.email, apiError.details['email']);
          break;
        }
        case ApiErrorEnum.INVALID_ARGUMENTS: {
          this.formComponent.setError(USER_FORM_KEYS.email, apiError.details['email']);
          this.formComponent.setError(USER_FORM_KEYS.password, apiError.details['password']);
          this.formComponent.setError(USER_FORM_KEYS.name, apiError.details['name']);
          break;
        }
      }
    } else {
      this.formComponent.setError(null, 'An unknown error has occurred.');
    }
  }
}
