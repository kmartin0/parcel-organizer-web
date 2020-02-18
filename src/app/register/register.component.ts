import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Validators} from '@angular/forms';
import {passwordMatchValidator} from '../validator/password-match.validator';
import {TextBoxInputField} from '../dynamic-form/input/text-box-input-field';
import {FormComponent} from '../dynamic-form/form/form.component';

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

  constructor() {
  }

  public ngOnInit() {
  }

  onRegisterValidSubmit(formKeyValues: { [key: string]: string; }) {
    alert('Success Login: ' + JSON.stringify(formKeyValues));
  }

}
