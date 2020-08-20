import {Component, OnInit, ViewChild} from '@angular/core';
import {UserAuthFormComponent} from '../../../../shared/components/user-authentication-form/user-auth-form.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../../../shared/services/user/user.service';
import {Router} from '@angular/router';
import {DASHBOARD, FORGOT_PASSWORD} from '../../../../shared/constants/endpoints';
import {RedirectService} from '../../../../shared/services/redirect/redirect.service';
import {User} from '../../../../shared/models/user';
import {withLoading} from '../../../../shared/helpers/operators';
import {UserFormComponent} from '../../../../shared/components/user-form/user-form.component';
import {Subject} from 'rxjs';
import {UserAuthentication} from '../../../../shared/models/user-authentication';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';
import {ThemeService} from '../../../../shared/services/theme/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading$ = new Subject<boolean>();
  isDarkTheme = this.themeService.isDarkTheme;

  formSelector: FormGroup;
  FORM_TYPES = FORM_TYPES;

  faIcons = {
    sun: faSun,
    moon: faMoon
  };

  faIconStyle: Styles = {
    width: '36px',
    height: '36px'
  };

  @ViewChild(UserAuthFormComponent, {static: false})
  userAuthFormComponent: UserAuthFormComponent;

  @ViewChild(UserFormComponent, {static: false})
  userFormComponent: UserFormComponent;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router,
              private redirectService: RedirectService, private themeService: ThemeService) {
    this.initFormSelect(formBuilder);
  }

  ngOnInit() {
  }

  authenticateUser(userAuthentication: UserAuthentication) {
    this.userService.loginUser(userAuthentication)
      .pipe(withLoading(this.loading$))
      .subscribe(value => {
        this.handleAuthSuccess();
      }, apiError => {
        this.userAuthFormComponent.handleApiError(apiError);
      });
  }

  registerUser(user: User) {
    this.userService.registerUser(user).pipe(
      withLoading(this.loading$)
    ).subscribe(user => {
      this.handleRegisterSuccess();
    }, apiError => {
      this.userFormComponent.handleApiError(apiError);
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  goToForgotPassword() {
    this.router.navigate([FORGOT_PASSWORD]);
  }

  private initFormSelect(formBuilder: FormBuilder) {
    this.formSelector = formBuilder.group({
      formSelect: [FORM_TYPES.LOGIN]
    });
  }

  private handleAuthSuccess() {
    this.userAuthFormComponent.displaySuccess(() => {
      const redirect = this.redirectService.consume();
      if (redirect) {
        this.router.navigateByUrl(redirect);
      } else {
        this.router.navigate([DASHBOARD]);
      }
    });
  }

  private handleRegisterSuccess() {
    this.userFormComponent.displaySuccess(() => {
      this.userFormComponent.resetForm();
      this.formSelector.controls.formSelect.setValue(FORM_TYPES.LOGIN);
    });
  }
}

export enum FORM_TYPES {
  LOGIN, REGISTER
}
