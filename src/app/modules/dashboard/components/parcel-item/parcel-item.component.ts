import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {
  faShoppingBag,
  faTruck,
  faClock,
  faShareAlt,
  faTrash,
  faBoxOpen,
  faShippingFast,
  faMoneyCheckAlt,
  faPen
} from '@fortawesome/free-solid-svg-icons';
import {MatDialog} from '@angular/material';
import {ParcelDeleteDialogComponent} from '../parcel-delete-dialog/parcel-delete-dialog.component';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {DashboardLoadingService} from '../dashboard-loading.service';
import {loadingIndicator} from '../../../../shared/helpers/operators';

@Component({
  selector: 'app-parcel-item',
  templateUrl: './parcel-item.component.html',
  styleUrls: ['./parcel-item.component.css']
})
export class ParcelItemComponent implements OnInit {

  @Input() parcel: Parcel;
  @Output() parcelDeleted = new EventEmitter<Parcel>();
  parcelStatuses = ParcelStatusEnum;

  faIcons = {
    sender: faShoppingBag,
    courier: faTruck,
    date: faClock,
    share: faShareAlt,
    edit: faPen,
    delete: faTrash,
    sent: faShippingFast,
    ordered: faMoneyCheckAlt,
    delivered: faBoxOpen,
  };

  faIconStyle = {
    width: '20px',
    height: '20px'
  };

  constructor(private dialog: MatDialog, private parcelService: ParcelService, private dashboardLoadingService: DashboardLoadingService) {
  }

  ngOnInit() {
  }

  onParcelDeleteClick() {
    const dialogRef = this.dialog.open(ParcelDeleteDialogComponent, {
      data: {parcelTitle: this.parcel.title},
      panelClass: 'app-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteParcel();
      }
    });
  }

  deleteParcel() {
    this.parcelService.deleteParcel(this.parcel.id)
      .pipe(loadingIndicator(this.dashboardLoadingService.loading$))
      .subscribe(value => {
        this.parcelDeleted.emit(this.parcel);
      });
  }

}
