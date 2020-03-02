import {Component, ViewChild} from '@angular/core';
import {LoginComponent} from '../../components/login/login.component';
import {RegisterComponent} from '../../components/register/register.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../../../shared/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

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

  onRegisterSuccess(user: User) {
    this.formSelector.controls.formSelect.setValue(FORM_TYPES.LOGIN);
  }

  onLoginSuccess(user: any) {

  }

}

export enum FORM_TYPES {
  LOGIN, REGISTER
}
