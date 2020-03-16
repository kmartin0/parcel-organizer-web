import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {USER_FORM_KEYS} from '../../../../shared/components/user-form/user.form';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../../../shared/anim/enter-leave.anim';
import {User} from '../../../../shared/models/user';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {UserFormComponent} from '../../../../shared/components/user-form/user-form.component';
import {UserService} from '../../../../shared/services/user.service';
import {withLoading} from '../../../../shared/helpers/operators';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  animations: [trigger('form', enterLeaveTransition)]
})
export class AccountComponent implements OnInit, AfterViewInit {

  loading$: Subject<boolean>;
  private loggedInUser: User;

  @ViewChild(UserFormComponent, {static: false}) private _userFormComponent: UserFormComponent;
  get userFormComponent(): UserFormComponent {
    return this._userFormComponent;
  }

  constructor(private dashboardLoadingService: DashboardLoadingService, private userService: UserService) {
    this.loading$ = dashboardLoadingService.loading$;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.populateForm();
  }

  populateForm() {
    this.loggedInUser = this.userService.getLoggedInUser();

    this.userFormComponent.formComponent.getFormControl(USER_FORM_KEYS.email).setValue(this.loggedInUser.email);
    this.userFormComponent.formComponent.getFormControl(USER_FORM_KEYS.name).setValue(this.loggedInUser.name);
  }

  onUserResult(user: User) {
    this.userService.updateUser(user).pipe(
      withLoading(this.loading$),
      switchMap(value => this.userService.loginUser(value.email, user.password).pipe(withLoading(this.loading$)))
    ).subscribe(user => {
      console.log(user);
      this.handleUserUpdateSuccess();
    }, error => {
      this.handleUserUpdateError(error);
    });
  }

  handleUserUpdateSuccess() {
    this.userFormComponent.displaySuccess(() => {
      this.userFormComponent.formComponent.resetForm({
        [USER_FORM_KEYS.email]: this.loggedInUser.email,
        [USER_FORM_KEYS.name]: this.loggedInUser.name
      });
    });
  }

  handleUserUpdateError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      this.userFormComponent.handleUserApiError(apiError);
      if (apiError.error == ApiErrorEnum.PERMISSION_DENIED) {
        this.userFormComponent.formComponent.setError(USER_FORM_KEYS.password, 'Incorrect password.');
      }
    }
  }

}
