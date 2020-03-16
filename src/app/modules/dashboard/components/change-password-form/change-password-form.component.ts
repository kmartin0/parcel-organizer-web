import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {CHANGE_PASSWORD_FORM, CHANGE_PASSWORD_FORM_KEYS} from './change-password-form';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';
import {ChangePassword} from '../../../../shared/models/change-password';
import {passwordMatchValidator} from '../../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.css']
})
export class ChangePasswordFormComponent implements OnInit {

  @Input() loading$: Subject<boolean>;
  @Output() changePasswordResult = new EventEmitter<ChangePassword>();
  changePasswordForm = CHANGE_PASSWORD_FORM;
  changePasswordFormValidator = [passwordMatchValidator(CHANGE_PASSWORD_FORM_KEYS.newPassword, CHANGE_PASSWORD_FORM_KEYS.confirmPassword, 'confirmPassword')];

  @ViewChild(FormComponent, {static: false}) private _formComponent: FormComponent;
  get formComponent(): FormComponent {
    return this._formComponent;
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  onValidForm(formValues) {
    const changePassword = new class implements ChangePassword {
      confirmPassword: string = formValues[CHANGE_PASSWORD_FORM_KEYS.confirmPassword];
      currentPassword: string = formValues[CHANGE_PASSWORD_FORM_KEYS.currentPassword];
      newPassword: string = formValues[CHANGE_PASSWORD_FORM_KEYS.newPassword];
    };
    this.changePasswordResult.emit(changePassword);
  }

  handleApiError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      switch (apiError.error) {
        case ApiErrorEnum.INVALID_ARGUMENTS: {
          this.formComponent.setError(CHANGE_PASSWORD_FORM_KEYS.newPassword, apiError.details['newPassword']);
          this.formComponent.setError(CHANGE_PASSWORD_FORM_KEYS.currentPassword, apiError.details['currentPassword']);
          break;
        }
        case ApiErrorEnum.PERMISSION_DENIED: {
          this.formComponent.setError(CHANGE_PASSWORD_FORM_KEYS.currentPassword, 'Incorrect password');
        }
      }
    } else {
      this.formComponent.setError(null, 'An unknown error has occurred.');
    }
  }

  displaySuccess(callback?: () => void) {
    this.formComponent.displaySuccess(() => {
      if (callback) {
        callback();
      }
    });
  }

}
