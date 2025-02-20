import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {ResetPassword} from '../../../../shared/models/reset-password';
import {ActivatedRoute, Router} from '@angular/router';
import {HOME} from '../../../../shared/constants/endpoints';
import {UserService} from '../../../../shared/services/user/user.service';
import {withLoading} from '../../../../shared/helpers/operators';
import {ResetPasswordFormComponent} from '../../components/reset-password-form/reset-password-form.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../../../../shared/styles/reset-forget-password.scss'],
  imports: [
    ResetPasswordFormComponent
  ],
  standalone: true
})
export class ResetPasswordComponent implements OnInit {

  loading$ = new Subject<boolean>();
  token?: string;
  message = '';

  error = 'Invalid or expired reset url.';
  success = 'Successfully reset password.';

  @ViewChild(ResetPasswordFormComponent, {static: false})
  private changePasswordFormComponent!: ResetPasswordFormComponent;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) {
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        const token = params['token'];
        token ? this.token = token : this.message = this.error;
      });
  }

  onSubmit(resetPassword: ResetPassword) {
    resetPassword.token = this.token;

    this.userService.resetPassword(resetPassword)
      .pipe(withLoading(this.loading$))
      .subscribe(value => {
        this.changePasswordFormComponent.displaySuccess(() => {
          this.changePasswordFormComponent.resetForm();
          this.message = this.success;
        });
      }, error => {
        this.changePasswordFormComponent.handleApiError(this.error);
      });
  }

  goToHome() {
    this.router.navigate([HOME]);
  }

}
