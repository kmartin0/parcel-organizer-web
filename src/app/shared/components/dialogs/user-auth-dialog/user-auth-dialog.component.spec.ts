import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {UserAuthDialogComponent} from './user-auth-dialog.component';
import SpyObj = jasmine.SpyObj;
import {UserService} from '../../../services/user/user.service';
import {UserAuthentication} from '../../../models/user-authentication';
import {UserAuthFormComponentStub} from '../../../../testing/user-auth-form.component.stub';
import {Oauth2Credentials} from '../../../models/oauth2-credentials';
import {of, throwError} from 'rxjs';
import {ApiErrorBody} from '../../../models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';

describe('UserAuthDialogComponent', () => {

  const messageData = 'Error something bad happened.';
  const loginSuccessCallback = () => {
  };

  let userServiceSpy: SpyObj<UserService>;
  let dialogRefSpy: SpyObj<MatDialogRef<UserAuthDialogComponent>>;

  let component: UserAuthDialogComponent;
  let fixture: ComponentFixture<UserAuthDialogComponent>;

  beforeEach(() => {
    // Initialize spies
    userServiceSpy = jasmine.createSpyObj('UserService', ['loginUser']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close'], {disableClose: true});
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [UserAuthDialogComponent, UserAuthFormComponentStub],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        {provide: MAT_DIALOG_DATA, useValue: {message: messageData, loginSuccess: loginSuccessCallback}},
        {provide: MatDialogRef, useValue: dialogRefSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAuthDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component.message).toEqual(messageData);
    expect(component.loginSuccessCallback).toEqual(loginSuccessCallback);
    expect(component).toBeTruthy();
  });

  it('should authenticate user, display success and close the dialog', () => {
    const userAuth: UserAuthentication = {
      email: 'user@gmail.com',
      password: '1234'
    };

    const oauth2Credentials: Oauth2Credentials = {
      access_token: 'ey12345',
      expires_in: '20000',
      jti: 'bees-lapp',
      refresh_token: '123fhn',
      scope: 'all',
      token_type: 'bearer'
    };

    userServiceSpy.loginUser.and.returnValue(of(oauth2Credentials));
    spyOn(component.userAuthFormComponent, 'displaySuccess').and.callThrough();

    // When
    component.authenticateUser(userAuth);

    // Then
    expect(component.userAuthFormComponent.displaySuccess).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });

  it('should let auth form handle api error', () => {
    // Given
    const userAuth: UserAuthentication = {
      email: 'user@gmail.com',
      password: '1234'
    };

    const apiError: ApiErrorBody = {
      error: ApiErrorEnum.INVALID_ARGUMENTS,
      description: 'Something bad happened',
      code: 400
    };

    userServiceSpy.loginUser.and.returnValue(throwError(apiError));
    spyOn(component.userAuthFormComponent, 'handleApiError');

    // When
    component.authenticateUser(userAuth);

    // Then
    expect(component.userAuthFormComponent.handleApiError).toHaveBeenCalledTimes(1);
    expect(component.userAuthFormComponent.handleApiError).toHaveBeenCalledWith(apiError);
  });
});
