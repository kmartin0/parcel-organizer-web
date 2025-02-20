import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-parcel-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['../dialog.component.scss'],
  imports: [
    MatDialogClose,
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
  ],
  standalone: true
})
export class DeleteDialogComponent implements OnInit {

  toDelete: string = '';

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { toDelete: string }) {
    this.toDelete = data.toDelete;
  }

  ngOnInit() {
  }

}
