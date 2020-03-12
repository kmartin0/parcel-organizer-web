import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {passwordMatchValidator} from '../../../../shared/validators/password-match.validator';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';
import {User} from '../../../../shared/models/user';
import {UserService} from '../../../../shared/services/user.service';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {loadingIndicator} from '../../../../shared/helpers/operators';
import {Subject} from 'rxjs';
import {BaseInputField} from '../../../../shared/components/dynamic-form/base-input-field';
import {REGISTER_FORM, REGISTER_FORM_KEYS} from '../../../../shared/forms/register.form';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  @Output() registerSuccess = new EventEmitter();

  registerForm: BaseInputField<any>[] = REGISTER_FORM;
  registerFormValidators = [passwordMatchValidator('password', 'confirmPassword', 'confirmPassword')];
  loading$ = new Subject<boolean>();

  @ViewChild(FormComponent, {static: false}) private _formComponent: FormComponent;
  get formComponent(): FormComponent {
    return this._formComponent;
  }

  constructor(private userService: UserService) {
  }

  public ngOnInit() {
  }

  onRegisterValidSubmit(formKeyValues: { [key: string]: string; }) {
    this.registerUser({
      id: null,
      email: formKeyValues.email,
      name: formKeyValues.name,
      password: formKeyValues.password
    });
  }

  private registerUser(user: User) {
    this.userService.registerUser(user).pipe(
      loadingIndicator(this.loading$)
    ).subscribe(user => {
      this.handleRegisterSuccess();
    }, apiError => {
      this.handleRegisterError(apiError);
    });
  }

  private handleRegisterSuccess() {
    this.formComponent.displaySuccess(() => {
      this.registerSuccess.emit();
    });
  }

  private handleRegisterError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      switch (apiError.error) {
        case  ApiErrorEnum.ALREADY_EXISTS : {
          this.formComponent.setError(REGISTER_FORM_KEYS.email, apiError.details['email']);
          break;
        }
        case ApiErrorEnum.INVALID_ARGUMENTS: {
          this.formComponent.setError(REGISTER_FORM_KEYS.email, apiError.details['email']);
          this.formComponent.setError(REGISTER_FORM_KEYS.password, apiError.details['password']);
          this.formComponent.setError(REGISTER_FORM_KEYS.name, apiError.details['name']);
          break;
        }
      }
    } else {
      this.formComponent.setError(null, 'An unknown error has occurred.');
    }
  }

}
