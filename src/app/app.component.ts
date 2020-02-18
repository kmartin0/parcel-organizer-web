import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  @ViewChild(LoginComponent, {static: false})
  private loginComponent: LoginComponent;

  @ViewChild(RegisterComponent, {static: false})
  private registerComponent: RegisterComponent;

  private formSelector: FormGroup;
  private FORM_TYPES = FORM_TYPES;

  constructor(formBuilder: FormBuilder) {
    this.initFormSelect(formBuilder);
  }

  private initFormSelect(formBuilder: FormBuilder) {
    this.formSelector = formBuilder.group({
      formSelect: [FORM_TYPES.LOGIN]
    });

    this.formSelector.get('formSelect').valueChanges.subscribe(value => {
      switch (value) {
        case FORM_TYPES.LOGIN : {
          this.loginComponent.formComponent.resetForm();
          break;
        }
        case FORM_TYPES.REGISTER : {
          this.registerComponent.formComponent.resetForm();
          break;
        }
      }
    });
  }
}

export enum FORM_TYPES {
  LOGIN, REGISTER
}

