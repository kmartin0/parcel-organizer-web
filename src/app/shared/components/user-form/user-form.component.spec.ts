import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormComponentStub} from '../../../testing/form.component.stub';
import {ApiErrorBody} from '../../models/api-error-body';
import {ApiErrorEnum} from '../../../api/api-error.enum';
import {UserAuthentication} from '../../models/user-authentication';
import {UserFormComponent} from './user-form.component';
import {USER_FORM, USER_FORM_KEYS} from './user.form';
import {User} from '../../models/user';

describe('UserFormComponent', () => {

  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserFormComponent, FormComponentStub],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set form component error when user already exists', () => {
    // Given
    const alreadyExists: ApiErrorBody = {
      code: 409,
      error: ApiErrorEnum.ALREADY_EXISTS,
      description: 'user already exists',
      details: {
        [USER_FORM_KEYS.email]: 'xyz@gmail.com already in use'
      }
    };

    spyOn(component.formComponent, 'setError');

    // When
    component.handleApiError(alreadyExists);

    // Then
    expect(component.formComponent.setError).toHaveBeenCalledTimes(1);
    expect(component.formComponent.setError).toHaveBeenCalledWith(USER_FORM_KEYS.email, alreadyExists.details[USER_FORM_KEYS.email]);
  });

  it('should set form component error when invalid arguments', () => {
    // Given
    const invalidArguments: ApiErrorBody = {
      code: 400,
      error: ApiErrorEnum.INVALID_ARGUMENTS,
      description: 'user already exists',
      details: {
        [USER_FORM_KEYS.email]: 'invalid email',
        [USER_FORM_KEYS.password]: 'too long',
        [USER_FORM_KEYS.name]: 'too short'
      }
    };

    spyOn(component.formComponent, 'setError');

    // When
    component.handleApiError(invalidArguments);

    // Then
    expect(component.formComponent.setError).toHaveBeenCalledTimes(3);
    expect(component.formComponent.setError).toHaveBeenCalledWith(USER_FORM_KEYS.email, invalidArguments.details[USER_FORM_KEYS.email]);
    expect(component.formComponent.setError).toHaveBeenCalledWith(USER_FORM_KEYS.password, invalidArguments.details[USER_FORM_KEYS.password]);
    expect(component.formComponent.setError).toHaveBeenCalledWith(USER_FORM_KEYS.name, invalidArguments.details[USER_FORM_KEYS.name]);
  });

  it('should set form component error when permission denied', () => {
    // Given
    const permissionDenied: ApiErrorBody = {
      code: 403,
      error: ApiErrorEnum.PERMISSION_DENIED,
      error_description: 'invalid credentials',
    };

    spyOn(component.formComponent, 'setError');

    // When
    component.handleApiError(permissionDenied);

    // Then
    expect(component.formComponent.setError).toHaveBeenCalledTimes(1);
    expect(component.formComponent.setError).toHaveBeenCalledWith(USER_FORM_KEYS.password, 'Incorrect password.');
  });

  it('should set form component error when unknown error', () => {
    // Given
    const unknownError = {
      error: 'unknown',
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
    const expected: User = {
      email: 'xyz@gmail.com',
      id: null,
      name: 'xyz',
      password: '1234',
      confirmPassword: '1234'
    };

    const input = {
      [USER_FORM_KEYS.email]: expected.email,
      [USER_FORM_KEYS.password]: expected.password,
      [USER_FORM_KEYS.name]: expected.name,
      [USER_FORM_KEYS.confirmPassword]: expected.confirmPassword
    };

    spyOn(component.validFormResult$, 'emit');

    // When
    component.onValidForm(input);

    // Then
    expect(component.validFormResult$.emit).toHaveBeenCalledTimes(1);
    expect(component.validFormResult$.emit).toHaveBeenCalledWith(expected);
  });

});
