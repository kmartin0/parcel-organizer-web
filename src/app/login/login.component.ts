import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Validators} from '@angular/forms';
import {TextBoxInputField} from '../dynamic-form/input/text-box-input-field';
import {FormComponent} from '../dynamic-form/form/form.component';
import {UserService} from '../service/user.service';
import {Subject} from 'rxjs';
import {loadingIndicator} from '../operators';
import {isApiErrorBody} from '../model/api-error-body';
import {ApiErrorEnum} from '../api-error.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Output() loginSuccess = new EventEmitter<any>();
  loading$ = new Subject<boolean>();

  @ViewChild(FormComponent, {static: false}) private _formComponent: FormComponent;
  get formComponent(): FormComponent {
    return this._formComponent;
  }

  loginForm: TextBoxInputField[] = [
    new TextBoxInputField({
      id: 'login-email',
      key: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'xyz@gmail.com',
      validators: [Validators.required, Validators.email]
    }),
    new TextBoxInputField({
      id: 'login-password',
      key: 'password',
      type: 'password',
      label: 'Password',
      placeholder: '\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf',
      validators: Validators.required
    })
  ];

  constructor(private userService: UserService) {
  }

  onLoginValidSubmit(formKeyValues: { [key: string]: string; }) {
    this.login(formKeyValues['email'], formKeyValues['password']);
  }

  private login(email: string, password: string) {
    this.userService.loginUser(email, password)
      .pipe(loadingIndicator(this.loading$))
      .subscribe(value => {
        this.onLoginSuccess(value);
      }, error => {
        this.onLoginError(error);
      });
  }

  private onLoginSuccess(value: any) {
    this.formComponent.displaySuccess(value);
  }

  private onLoginError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      if (apiError.error === ApiErrorEnum.invalid_grant) {
        this.formComponent.setError(null, 'Username/password incorrect.');
      }
    } else {
      this.formComponent.setError(null, 'An unknown error has occurred.');
    }
  }

}
