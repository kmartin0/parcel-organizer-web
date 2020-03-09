import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Parcel} from '../../../../shared/models/parcel';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-parcel-delete-dialog',
  templateUrl: './parcel-delete-dialog.component.html',
  styleUrls: ['./parcel-delete-dialog.component.css']
})
export class ParcelDeleteDialogComponent implements OnInit {

  deleteIcon = faTrash;
  parcelTitle: string = '';

  deleteIconStyle: Styles = {
    width: '28px',
    height: '28px',
    color: 'red'
  };

  constructor(public dialogRef: MatDialogRef<Parcel>,
              @Inject(MAT_DIALOG_DATA) public data: { parcelTitle: string }) {
    this.parcelTitle = data.parcelTitle;
  }

  ngOnInit() {
  }

}
