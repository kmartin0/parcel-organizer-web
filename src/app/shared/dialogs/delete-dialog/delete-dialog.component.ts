import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-parcel-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['../dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  deleteIcon = faTrash;
  toDelete: string = '';

  deleteIconStyle: Styles = {
    width: '28px',
    height: '28px',
    color: 'red'
  };

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { toDelete: string }) {
    this.toDelete = data.toDelete;

  }

  ngOnInit() {
  }

}
