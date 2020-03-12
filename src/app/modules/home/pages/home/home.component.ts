import {Component, OnInit, ViewChild} from '@angular/core';
import {LoginFormComponent} from '../../../../shared/components/login-form/login-form.component';
import {RegisterFormComponent} from '../../components/register-form/register-form.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../../../shared/services/user.service';
import {Router} from '@angular/router';
import {DASHBOARD} from '../../../../shared/constants/endpoints';
import {RedirectService} from '../../../../shared/services/redirect.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  formSelector: FormGroup;
  FORM_TYPES = FORM_TYPES;

  @ViewChild(LoginFormComponent, {static: false})
  private loginComponent: LoginFormComponent;

  @ViewChild(RegisterFormComponent, {static: false})
  private registerComponent: RegisterFormComponent;

  constructor(formBuilder: FormBuilder, private userService: UserService, private router: Router, private redirectService: RedirectService) {
    this.initFormSelect(formBuilder);
  }

  ngOnInit() {
  }

  onRegisterSuccess() {
    this.formSelector.controls.formSelect.setValue(FORM_TYPES.LOGIN);
  }

  onLoginSuccess() {
    const redirect = this.redirectService.redirect;
    if (redirect) {
      this.router.navigateByUrl(redirect);
    } else {
      this.router.navigate([DASHBOARD]);
    }
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
