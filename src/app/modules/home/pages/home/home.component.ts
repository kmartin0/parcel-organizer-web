import {Component, OnInit, ViewChild} from '@angular/core';
import {LoginComponent} from '../../../../shared/components/login/login.component';
import {RegisterComponent} from '../../components/register/register.component';
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

  @ViewChild(LoginComponent, {static: false})
  private loginComponent: LoginComponent;

  @ViewChild(RegisterComponent, {static: false})
  private registerComponent: RegisterComponent;

  private formSelector: FormGroup;
  private FORM_TYPES = FORM_TYPES;

  constructor(formBuilder: FormBuilder, private userService: UserService, private router: Router, private redirectService: RedirectService) {
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

  ngOnInit(): void {
  }

}

export enum FORM_TYPES {
  LOGIN, REGISTER
}
