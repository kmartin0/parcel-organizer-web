import {Component, OnInit, ViewChild} from '@angular/core';
import {Validators} from '@angular/forms';
import {TextBoxInputField} from '../dynamic-form/input/text-box-input-field';
import {FormComponent} from '../dynamic-form/form/form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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

  constructor() {
  }

  public ngOnInit() {

  }

  onLoginValidSubmit(formKeyValues: { [key: string]: string; }) {
    alert('Success Login: ' +  JSON.stringify(formKeyValues));
  }
}
