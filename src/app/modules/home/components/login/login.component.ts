import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Validators} from '@angular/forms';
import {TextBoxInputField} from '../../../../shared/components/dynamic-form/input/text-box-input-field';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';
import {UserService} from '../../../../shared/services/user.service';
import {Subject} from 'rxjs';
import {loadingIndicator} from '../../../../shared/helpers/operators';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {Router} from '@angular/router';
import {DASHBOARD} from '../../../../shared/constants/endpoints';
import {RedirectService} from '../../../../shared/services/redirect.service';

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

  constructor(private userService: UserService, private router: Router, private redirectService: RedirectService) {
  }

  onLoginValidSubmit(formKeyValues: { [key: string]: string; }) {
    this.login(formKeyValues['email'], formKeyValues['password']);
  }

  private login(email: string, password: string) {
    this.userService.loginUser(email, password)
      .pipe(loadingIndicator(this.loading$))
      .subscribe(value => {
        this.formComponent.displaySuccess(value);
      }, error => {
        this.onLoginError(error);
      });
  }

  private onLoginSuccess(value: any) {
    const redirect = this.redirectService.redirect;
    if (redirect) {
      this.router.navigateByUrl(redirect);
    } else {
      this.router.navigate([DASHBOARD]);
    }
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
