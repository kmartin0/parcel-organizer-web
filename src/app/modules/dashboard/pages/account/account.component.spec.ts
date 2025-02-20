import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {AccountComponent} from './account.component';
import {of, Subject, throwError} from 'rxjs';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {UserService} from '../../../../shared/services/user/user.service';
import {User} from '../../../../shared/models/user';
import {UntypedFormControl} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {USER_FORM_KEYS} from '../../../../shared/components/user-form/user.form';
import {ApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {ChangePassword} from '../../../../shared/models/change-password';
import {FormComponentStub} from '../../../../testing/form.component.stub';
import {UserFormComponentStub} from '../../../../testing/user-form.component.stub';
import {ChangePasswordFormComponentStub} from '../../../../testing/change-password-form.component.stub';
import {UserFormComponent} from '../../../../shared/components/user-form/user-form.component';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';
import {ChangePasswordFormComponent} from '../../components/change-password-form/change-password-form.component';

describe('AccountComponent', () => {

  let dashboardLoadingServiceSpy: jasmine.SpyObj<DashboardLoadingService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let formControlSpy: jasmine.SpyObj<UntypedFormControl>;

  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  const loggedInUser: User = {
    id: '1',
    email: 'testuser@gmail.com',
    name: 'test user'
  };

  beforeEach(() => {
    // Initialize spies
    dashboardLoadingServiceSpy = jasmine.createSpyObj('DashboardLoadingService', [], [{loading$: new Subject()}]);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getLoggedInUser', 'updateUser', 'changePassword']);
    formControlSpy = jasmine.createSpyObj('FormControl', ['setValue']);

    // Setup spy return values
    userServiceSpy.getLoggedInUser.and.returnValue(of(loggedInUser));
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, AccountComponent],
      declarations: [],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        {provide: DashboardLoadingService, useValue: dashboardLoadingServiceSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(AccountComponent, {
        remove: {imports: [UserFormComponent, FormComponent, ChangePasswordFormComponent]},
        add: {imports: [UserFormComponentStub, FormComponentStub, ChangePasswordFormComponentStub]},
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
    spyOn(component.userFormComponent.formComponent, 'getFormControl').and.returnValue(formControlSpy);

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
    spyOn(component.userFormComponent, 'displaySuccess').and.callThrough();
    spyOn(component.userFormComponent.formComponent, 'resetForm');

    // When
    component.onUserResult(updatedUser);

    // Then
    expect(component.userFormComponent.displaySuccess).toHaveBeenCalledTimes(1);
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
    spyOn(component.changePasswordFormComponent, 'displaySuccess').and.callThrough();

    // When
    component.onChangePasswordResult(changePassword);

    // Then
    expect(component.changePasswordFormComponent.displaySuccess).toHaveBeenCalledTimes(1);
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
