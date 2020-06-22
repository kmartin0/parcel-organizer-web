import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {AccountComponent} from './account.component';
import {of, Subject, throwError} from 'rxjs';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {UserService} from '../../../../shared/services/user.service';
import {User} from '../../../../shared/models/user';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';
import {UserFormComponent} from '../../../../shared/components/user-form/user-form.component';
import {FormControl} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {USER_FORM_KEYS} from '../../../../shared/components/user-form/user.form';
import {ApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {ChangePassword} from '../../../../shared/models/change-password';
import {ChangePasswordFormComponent} from '../../components/change-password-form/change-password-form.component';

describe('AccountComponent', () => {

  let dashboardLoadingServiceSpy: jasmine.SpyObj<DashboardLoadingService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let formControlSpy: jasmine.SpyObj<FormControl>;

  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  const loggedInUser: User = {
    id: '1',
    email: 'testuser@gmail.com',
    name: 'test user'
  };

  @Component({
    selector: 'app-form',
    template: '',
    providers: [{provide: FormComponent, useClass: FormComponentStub}]
  })
  class FormComponentStub {
    getFormControl(key: string): FormControl {
      return formControlSpy;
    }

    resetForm(value?: any) {
    }
  }

  @Component({
    selector: 'app-user-form',
    template: '',
    providers: [{provide: UserFormComponent, useClass: UserFormComponentStub}],
  })
  class UserFormComponentStub {
    _formComponent = TestBed.createComponent(FormComponentStub).componentInstance as FormComponent;
    public get formComponent(): FormComponent {
      return this._formComponent;
    }

    displaySuccess(callback?: () => void) {
    }

    handleApiError(apiError: any) {
    }
  }

  @Component({
    selector: 'app-change-password-form',
    template: '',
    providers: [{provide: ChangePasswordFormComponent, useClass: ChangePasswordFormComponentStub}],
  })
  class ChangePasswordFormComponentStub {
    _formComponent = TestBed.createComponent(FormComponentStub).componentInstance as FormComponent;
    public get formComponent(): FormComponent {
      return this._formComponent;
    }

    displaySuccess(callback?: () => void) {
    }

    handleApiError(apiError: any) {
    }
  }

  beforeEach(() => {
    // Initialize spies
    dashboardLoadingServiceSpy = jasmine.createSpyObj('DashboardLoadingService', [], [{loading$: new Subject()}]);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getLoggedInUser', 'updateUser', 'changePassword']);
    formControlSpy = jasmine.createSpyObj('FormControl', ['setValue']);

    // Setup spy return values
    userServiceSpy.getLoggedInUser.and.returnValue(of(loggedInUser));
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [AccountComponent, UserFormComponentStub, FormComponentStub, ChangePasswordFormComponentStub],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        {provide: DashboardLoadingService, useValue: dashboardLoadingServiceSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call populate form after view init', () => {
    // Given
    formControlSpy.setValue.calls.reset();
    spyOn(component, 'populateForm').and.callThrough();
    spyOn(component.userFormComponent.formComponent, 'getFormControl').and.callThrough();

    // When
    component.ngAfterViewInit();

    // Then
    expect(component.populateForm).toHaveBeenCalledTimes(1);

    expect(component.userFormComponent.formComponent.getFormControl).toHaveBeenCalledTimes(2);
    expect(component.userFormComponent.formComponent.getFormControl).toHaveBeenCalledWith(USER_FORM_KEYS.email);
    expect(component.userFormComponent.formComponent.getFormControl).toHaveBeenCalledWith(USER_FORM_KEYS.name);

    expect(formControlSpy.setValue).toHaveBeenCalledTimes(2);
    expect(formControlSpy.setValue).toHaveBeenCalledWith(loggedInUser.email);
    expect(formControlSpy.setValue).toHaveBeenCalledWith(loggedInUser.name);
  });

  it('should display success and reset user form when user update success', () => {
    // Given
    const updatedUser: User = {
      id: loggedInUser.id,
      name: 'New Name',
      email: loggedInUser.email
    };

    userServiceSpy.updateUser.and.returnValue(of(updatedUser));
    spyOn(component.userFormComponent, 'displaySuccess').and.callFake((func) => {
      func();
    });

    spyOn(component.userFormComponent.formComponent, 'resetForm');

    // When
    component.onUserResult(updatedUser);

    // Then
    expect(component.userFormComponent.displaySuccess).toHaveBeenCalledTimes(1);
    expect(component.userFormComponent.formComponent.resetForm).toHaveBeenCalledTimes(1);
    expect(component.userFormComponent.formComponent.resetForm).toHaveBeenCalledWith({
      [USER_FORM_KEYS.email]: updatedUser.email,
      [USER_FORM_KEYS.name]: updatedUser.name
    });
  });

  it('should let user form component handle api error', () => {
    // Given
    const permissionDeniedBody: ApiErrorBody = {
      code: 403,
      error: ApiErrorEnum.PERMISSION_DENIED,
      description: 'Permission Denied, invalid credentials',
    };
    userServiceSpy.updateUser.and.returnValue(throwError(permissionDeniedBody));
    spyOn(component.userFormComponent, 'handleApiError');

    // When
    component.onUserResult(loggedInUser);

    // Then
    expect(component.userFormComponent.handleApiError).toHaveBeenCalledTimes(1);
    expect(component.userFormComponent.handleApiError).toHaveBeenCalledWith(permissionDeniedBody);
  });

  it('should display success and reset change password form when password update success', () => {
    // Given
    const changePassword: ChangePassword = {
      confirmPassword: '123',
      currentPassword: '1234',
      newPassword: '123'
    };

    userServiceSpy.changePassword.and.returnValue(of(changePassword));
    spyOn(component.changePasswordFormComponent.formComponent, 'resetForm');
    spyOn(component.changePasswordFormComponent, 'displaySuccess').and.callFake((func) => {
      func();
    });

    // When
    component.onChangePasswordResult(changePassword);

    // Then
    expect(component.changePasswordFormComponent.displaySuccess).toHaveBeenCalledTimes(1);
    expect(component.changePasswordFormComponent.formComponent.resetForm).toHaveBeenCalledTimes(1);
    expect(component.changePasswordFormComponent.formComponent.resetForm).toHaveBeenCalledWith();
  });

  it('should let change password form component handle api error', () => {
    // Given
    const changePassword: ChangePassword = {
      confirmPassword: '123',
      currentPassword: '1234',
      newPassword: '123'
    };

    const permissionDeniedBody: ApiErrorBody = {
      code: 403,
      error: ApiErrorEnum.PERMISSION_DENIED,
      description: 'Permission Denied, invalid credentials',
    };
    userServiceSpy.changePassword.and.returnValue(throwError(permissionDeniedBody));
    spyOn(component.changePasswordFormComponent, 'handleApiError');

    // When
    component.onChangePasswordResult(changePassword);

    // Then
    expect(component.changePasswordFormComponent.handleApiError).toHaveBeenCalledTimes(1);
    expect(component.changePasswordFormComponent.handleApiError).toHaveBeenCalledWith(permissionDeniedBody);
  });

});
