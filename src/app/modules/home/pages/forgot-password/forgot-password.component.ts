import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {UserService} from '../../../../shared/services/user/user.service';
import {withLoading} from '../../../../shared/helpers/operators';
import {Router} from '@angular/router';
import {HOME} from '../../../../shared/constants/endpoints';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss', '../../../../shared/styles/reset-forget-password.scss']
})
export class ForgotPasswordComponent implements OnInit {

  loading$ = new Subject<boolean>();
  message = '';

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(email: string) {
    this.userService.forgotPassword(email)
      .pipe(withLoading(this.loading$))
      .subscribe(value => {
        this.message = 'A reset link has been sent to your email.';
      }, error => {
        this.message = 'An error occurred, please try again or contact us.';
      });
  }

  goToHome() {
    this.router.navigate([HOME]);
  }

}
