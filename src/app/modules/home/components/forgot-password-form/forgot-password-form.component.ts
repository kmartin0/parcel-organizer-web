import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../../shared/components/dynamic-form/base-form.component';
import {FORGOT_PASSWORD_FORM} from './forgot-password.form';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent extends BaseFormComponent<string> implements OnInit {

  constructor() {
    super();
    this.formAction = 'Reset'
  }

  ngOnInit(): void {
  }

  get form() {
    return FORGOT_PASSWORD_FORM;
  }

  handleApiError(apiError: any) {
  }

  onValidForm(formValues: { email: string }) {
    this.validFormResult$.emit(formValues.email);
  }

}
