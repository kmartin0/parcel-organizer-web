import {Component, Inject, OnInit} from '@angular/core';
import {faBomb} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['../dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {

  errorIcon = faBomb;
  message: string = '';

  errorIconStyle: Styles = {
    width: '28px',
    height: '28px',
    color: 'red'
  };

  constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { message: string }) {
    this.message = data.message;
  }

  ngOnInit() {
  }

}
