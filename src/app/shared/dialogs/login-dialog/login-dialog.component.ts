import {Component, Inject, OnInit} from '@angular/core';
import {faInfo} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['../dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  infoIcon = faInfo;
  message: string = '';
  loginSuccessCallback: () => {};

  infoIconStyle: Styles = {
    width: '28px',
    height: '28px',
    color: 'red'
  };

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { message: string, loginSuccess: () => {} }) {
    dialogRef.disableClose = true;
    this.message = data.message;
    this.loginSuccessCallback = data.loginSuccess;
  }

  ngOnInit() {
  }

  onLoginSuccess() {
    this.dialogRef.close(true);
  }

}
