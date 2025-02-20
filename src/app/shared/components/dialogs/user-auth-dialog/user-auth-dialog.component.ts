import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {UserAuthentication} from '../../../models/user-authentication';
import {withLoading} from '../../../helpers/operators';
import {UserAuthFormComponent} from '../../user-authentication-form/user-auth-form.component';
import {UserService} from '../../../services/user/user.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './user-auth-dialog.component.html',
  styleUrls: ['../dialog.component.scss'],
  imports: [
    MatDialogContent,
    MatDialogActions,
    UserAuthFormComponent,
    MatDialogClose,
    MatIconModule
  ],
  standalone: true
})
export class UserAuthDialogComponent implements OnInit {

  loading$ = new Subject<boolean>();

  message = '';
  loginSuccessCallback: () => {};


  @ViewChild(UserAuthFormComponent, {static: false})
  userAuthFormComponent!: UserAuthFormComponent;

  constructor(private userService: UserService, public dialogRef: MatDialogRef<UserAuthDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { message: string, loginSuccess: () => {} }) {
    dialogRef.disableClose = true;
    this.message = data.message;
    this.loginSuccessCallback = data.loginSuccess;
  }

  ngOnInit() {
  }

  authenticateUser(userAuthentication: UserAuthentication) {
    this.userService.loginUser(userAuthentication)
      .pipe(withLoading(this.loading$))
      .subscribe(value => {
        this.userAuthFormComponent.displaySuccess(() => {
          this.dialogRef.close(true);
        });
      }, apiError => {
        this.userAuthFormComponent.handleApiError(apiError);
      });
  }

}
