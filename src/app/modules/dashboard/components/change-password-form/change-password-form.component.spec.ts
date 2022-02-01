import {ChangePasswordFormComponent} from './change-password-form.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CHANGE_PASSWORD_FORM_KEYS} from './change-password-form';
import {ChangePassword} from '../../../../shared/models/change-password';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {FormComponentStub} from '../../../../testing/form.component.stub';

describe('ChangePasswordFormComponent', () => {

  let component: ChangePasswordFormComponent;
  let fixture: ComponentFixture<ChangePasswordFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordFormComponent, FormComponentStub],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit ChangePassword object when form is valid.', () => {
    // Given
    const curPass = 'pass';
    const newPass = '1234';
    const confirmPass = '1234';

    const formValue = {
      [CHANGE_PASSWORD_FORM_KEYS.confirmPassword]: confirmPass,
      [CHANGE_PASSWORD_FORM_KEYS.newPassword]: newPass,
      [CHANGE_PASSWORD_FORM_KEYS.currentPassword]: curPass,
    };

    const expectedResult: ChangePassword = {
      confirmPassword: confirmPass,
      currentPassword: curPass,
      newPassword: newPass
    };

    spyOn(component.validFormResult$, 'emit');

    // When
    component.onValidForm(formValue);

    // Then
    expect(component.validFormResult$.emit).toHaveBeenCalledTimes(1);
    expect(component.validFormResult$.emit).toHaveBeenCalledWith(expectedResult);
  });

  it('should handle invalid arguments', () => {
    // Given
    const newPassError = 'Too Long';
    const curPassError = 'Must not be empty';

    const invalidArgumentError: ApiErrorBody = {
      code: 400,
      error: ApiErrorEnum.INVALID_ARGUMENTS,
      description: 'Invalid Arguments Supplied',
      details: {
        [CHANGE_PASSWORD_FORM_KEYS.newPassword]: newPassError,
        [CHANGE_PASSWORD_FORM_KEYS.currentPassword]: curPassError
      }
    };

    spyOn(component.formComponent, 'setError');

    // When
    component.handleApiError(invalidArgumentError);

    // Then
    expect(component.formComponent.setError).toHaveBeenCalledTimes(2);
    expect(component.formComponent.setError).toHaveBeenCalledWith(CHANGE_PASSWORD_FORM_KEYS.newPassword, newPassError);
    expect(component.formComponent.setError).toHaveBeenCalledWith(CHANGE_PASSWORD_FORM_KEYS.currentPassword, curPassError);
  });

  it('should handle permission denied', () => {
    // Given
    const permissionDeniedBody: ApiErrorBody = {
      code: 403,
      error: ApiErrorEnum.PERMISSION_DENIED,
      description: 'Permission Denied, invalid credentials',
    };

    spyOn(component.formComponent, 'setError');

    // When
    component.handleApiError(permissionDeniedBody);

    // Then
    expect(component.formComponent.setError).toHaveBeenCalledTimes(1);
    expect(component.formComponent.setError).toHaveBeenCalledWith(CHANGE_PASSWORD_FORM_KEYS.currentPassword, 'Incorrect password');
  });

  it('should handle api unknown errors', () => {
    // Given
    const unknownErrorBody = {
      code: 403,
      error: 'Something else happened',
    };

    spyOn(component.formComponent, 'setError');

    // When
    component.handleApiError(unknownErrorBody);

    // Then
    expect(component.formComponent.setError).toHaveBeenCalledTimes(1);
    expect(component.formComponent.setError).toHaveBeenCalledWith(null, 'An unknown error has occurred.');
  });

});
