import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FORM_TYPES, HomeComponent} from './home.component';
import {ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../../../shared/services/user.service';
import {Router} from '@angular/router';
import {RedirectService} from '../../../../shared/services/redirect.service';
import {ThemeService} from '../../../../shared/services/theme.service';
import {UserAuthentication} from '../../../../shared/models/user-authentication';
import {of, throwError} from 'rxjs';
import {Oauth2Credentials} from '../../../../shared/models/oauth2-credentials';
import {DASHBOARD} from '../../../../shared/constants/endpoints';
import {UserAuthFormComponentStub} from '../../../../testing/user-auth-form.component.stub';
import {UserFormComponentStub} from '../../../../testing/user-form.component.stub';
import {User} from '../../../../shared/models/user';
import {ApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';

describe('HomeComponent', () => {

  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let redirectServiceSpy: jasmine.SpyObj<RedirectService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    // Initialize spies
    userServiceSpy = jasmine.createSpyObj('UserService', ['loginUser', 'registerUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    redirectServiceSpy = jasmine.createSpyObj('RedirectService', [], {redirect: ''});
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HomeComponent, UserAuthFormComponentStub, UserFormComponentStub],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: RedirectService, useValue: redirectServiceSpy},
        {provide: ThemeService, useValue: themeServiceSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize form selector with login', () => {
    expect(component.formSelector.value['formSelect']).toEqual(FORM_TYPES.LOGIN);
  });

  it('should login user using the user service and navigate to dashboard', () => {
    // Given
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

    userServiceSpy.loginUser.withArgs(userAuth).and.returnValue(of(oauth2Credentials));
    spyOn(component.userAuthFormComponent, 'displaySuccess').and.callThrough();

    // When
    component.authenticateUser(userAuth);

    // Then
    expect(component.userAuthFormComponent.displaySuccess).toHaveBeenCalledTimes(1);

    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith([DASHBOARD]);
  });

  it('should navigate to redirect url after login', () => {
    // Given
    const redirectUrl = '/redirect-here';
    // @ts-ignore
    Object.getOwnPropertyDescriptor(redirectServiceSpy, 'redirect').get.and.returnValue(redirectUrl);

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
    expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(redirectUrl);
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

  it('should register user and switch back to login form', () => {
    // Given
    const user: User = {
      id: '0',
      email: 'user@gmail.com',
      name: 'John',
      password: '1234',
      confirmPassword: '1234'
    };

    component.formSelector.controls.formSelect.setValue(FORM_TYPES.REGISTER);
    userServiceSpy.registerUser.withArgs(user).and.returnValue(of(user));
    spyOn(component.userFormComponent, 'displaySuccess').and.callThrough();

    // When
    component.registerUser(user);

    // Then
    expect(component.userFormComponent.displaySuccess).toHaveBeenCalledTimes(1);
    expect(component.formSelector.value['formSelect']).toEqual(FORM_TYPES.LOGIN);
  });

  it('should let auth form handle api error', () => {
    // Given
    const user: User = {
      id: '0',
      email: 'user@gmail.com',
      name: 'John',
      password: '1234',
      confirmPassword: '1234'
    };

    const apiError: ApiErrorBody = {
      error: ApiErrorEnum.INVALID_ARGUMENTS,
      description: 'Something bad happened',
      code: 400
    };

    userServiceSpy.registerUser.and.returnValue(throwError(apiError));
    spyOn(component.userFormComponent, 'handleApiError');

    // When
    component.registerUser(user);

    // Then
    expect(component.userFormComponent.handleApiError).toHaveBeenCalledTimes(1);
    expect(component.userFormComponent.handleApiError).toHaveBeenCalledWith(apiError);
  });

  it('should toggle theme using theme service', () => {
    // Given
    component.toggleTheme();

    expect(themeServiceSpy.toggleTheme).toHaveBeenCalledTimes(1);
  });
});
