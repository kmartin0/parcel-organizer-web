import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormComponent} from '../dynamic-form/form/form.component';
import {UserService} from '../../services/user.service';
import {Subject} from 'rxjs';
import {loadingIndicator} from '../../helpers/operators';
import {isApiErrorBody} from '../../models/api-error-body';
import {ApiErrorEnum} from '../../../api/api-error.enum';
import {LOGIN_FORM} from '../../forms/login.form';
import {BaseInputField} from '../dynamic-form/base-input-field';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Input() confirmButtonWidth = '50%';
  @Output() loginSuccess = new EventEmitter<any>();
  loading$ = new Subject<boolean>();

  @ViewChild(FormComponent, {static: false}) private _formComponent: FormComponent;
  get formComponent(): FormComponent {
    return this._formComponent;
  }

  loginForm: BaseInputField<any>[] = LOGIN_FORM;

  constructor(private userService: UserService) {
  }

  onLoginValidSubmit(formKeyValues: { [key: string]: string; }) {
    this.login(formKeyValues['email'], formKeyValues['password']);
  }

  private login(email: string, password: string) {
    this.userService.loginUser(email, password)
      .pipe(loadingIndicator(this.loading$))
      .subscribe(value => {
        this.onLoginSuccess();
      }, error => {
        this.onLoginError(error);
      });
  }

  private onLoginSuccess() {
    this.formComponent.displaySuccess(() => {
      this.loginSuccess.emit();
    });
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
