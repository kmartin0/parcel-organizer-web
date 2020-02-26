import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Validators} from '@angular/forms';
import {passwordMatchValidator} from '../validator/password-match.validator';
import {TextBoxInputField} from '../dynamic-form/input/text-box-input-field';
import {FormComponent} from '../dynamic-form/form/form.component';
import {User} from '../model/user';
import {UserService} from '../service/user.service';
import {isApiErrorBody} from '../model/api-error-body';
import {ApiErrorEnum} from '../api-error.enum';
import {loadingIndicator} from '../operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() public registerSuccess = new EventEmitter<User>();
  @ViewChild(FormComponent, {static: false}) private _formComponent: FormComponent;
  get formComponent(): FormComponent {
    return this._formComponent;
  }

  loading$ = new Subject<boolean>();

  registerForm: TextBoxInputField[] = [
    new TextBoxInputField({
      id: 'register-email',
      key: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'xyz@gmail.com',
      validators: [Validators.required, Validators.email]
    }),
    new TextBoxInputField({
      id: 'register-name',
      key: 'name',
      type: 'text',
      label: 'Name',
      placeholder: 'John Doe'
    }),
    new TextBoxInputField({
      id: 'register-password',
      key: 'password',
      type: 'password',
      label: 'Password',
      placeholder: '\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf',
      validators: [Validators.required, Validators.minLength(6)]
    }),
    new TextBoxInputField({
      id: 'register-confirm-password',
      key: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      placeholder: '\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf',
      validators: [Validators.required, Validators.minLength(6)]
    })
  ];

  registerFormValidators = [passwordMatchValidator('password', 'confirmPassword', 'confirmPassword')];

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
      this.handleRegisterSuccess(user);
    }, apiError => {
      this.handleRegisterError(apiError);
    });
  }

  private handleRegisterSuccess(user: User) {
    this.formComponent.displaySuccess(() => {
      this.registerSuccess.emit(user);
    });
  }

  private handleRegisterError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      switch (apiError.error) {
        case  ApiErrorEnum.ALREADY_EXISTS : {
          this.formComponent.setError('email', apiError.details['email']);
          break;
        }
        case ApiErrorEnum.INVALID_ARGUMENTS: {
          this.formComponent.setError('email', apiError.details['email']);
          this.formComponent.setError('password', apiError.details['password']);
          this.formComponent.setError('name', apiError.details['name']);
          break;
        }
      }
    } else {
      this.formComponent.setError(null, 'An unknown error has occurred.');
    }
  }

}
