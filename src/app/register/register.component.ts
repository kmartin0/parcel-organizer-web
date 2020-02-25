import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Validators} from '@angular/forms';
import {passwordMatchValidator} from '../validator/password-match.validator';
import {TextBoxInputField} from '../dynamic-form/input/text-box-input-field';
import {FormComponent} from '../dynamic-form/form/form.component';
import {User} from '../model/user';
import {UserService} from '../service/user.service';
import {isApiErrorBody} from '../model/api-error-body';
import {ApiErrorEnum} from '../api-error.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() public registerSuccess = new EventEmitter();
  @ViewChild(FormComponent, {static: false}) private _formComponent: FormComponent;
  get formComponent(): FormComponent {
    return this._formComponent;
  }

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
    this.userService.registerUser(user).subscribe(user => {
      this.handleRegisterSuccess(user);
    }, apiError => {
      this.handleRegisterErrors(apiError);
    });
  }

  private handleRegisterSuccess(user: User) {
    window.alert(`User Registered: ${JSON.stringify(user)}`);
  }

  private handleRegisterErrors(apiError: any) {
    if (isApiErrorBody(apiError) && apiError.error === ApiErrorEnum.ALREADY_EXISTS) {
      this.formComponent.setError('email', apiError.details['email']);
    } else {
      console.log('Unknown Api Error', apiError);
    }
  }

}
