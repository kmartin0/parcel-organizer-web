import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {UserAuthFormComponent} from './user-auth-form.component';
import {FormComponentStub} from '../../../testing/form.component.stub';
import {ApiErrorBody} from '../../models/api-error-body';
import {ApiErrorEnum} from '../../../api/api-error.enum';
import {USER_AUTH_FORM_KEYS} from './user-auth.form';
import {UserAuthentication} from '../../models/user-authentication';

describe('UserAuthFormComponent', () => {

  let component: UserAuthFormComponent;
  let fixture: ComponentFixture<UserAuthFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserAuthFormComponent, FormComponentStub],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set form component error when username password incorrect', () => {
    // Given
    const invalidGrant: ApiErrorBody = {
      code: 401,
      error: ApiErrorEnum.invalid_grant,
      description: 'Permission Denied, invalid credentials',
    };

    spyOn(component.formComponent, 'setError');

    // When
    component.handleApiError(invalidGrant);

    // Then
    expect(component.formComponent.setError).toHaveBeenCalledTimes(1);
    expect(component.formComponent.setError).toHaveBeenCalledWith(null, 'Username/password incorrect.');
  });

  it('should set form component when unknown error occurs', () => {
    // Given
    const unknownError = {
      description: 'Something happened',
    };

    spyOn(component.formComponent, 'setError');

    // When
    component.handleApiError(unknownError);

    // Then
    expect(component.formComponent.setError).toHaveBeenCalledTimes(1);
    expect(component.formComponent.setError).toHaveBeenCalledWith(null, 'An unknown error has occurred.');
  });

  it('should emit UserAuthentication from input', () => {
    // Given
    const expected: UserAuthentication = {
      email: 'input@gmail.com',
      password: '1234'
    };

    const input = {
      [USER_AUTH_FORM_KEYS.email]: expected.email,
      [USER_AUTH_FORM_KEYS.password]: expected.password
    };

    spyOn(component.validFormResult$, 'emit');

    // When
    component.onValidForm(input);

    // Then
    expect(component.validFormResult$.emit).toHaveBeenCalledTimes(1);
    expect(component.validFormResult$.emit).toHaveBeenCalledWith(expected);
  });

});
