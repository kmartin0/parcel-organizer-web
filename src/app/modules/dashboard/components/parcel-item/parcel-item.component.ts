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
  faPen, faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import {DeleteDialogComponent} from '../../../../shared/components/dialogs/delete-dialog/delete-dialog.component';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {DashboardLoadingService} from '../../pages/dashboard/dashboard-loading.service';
import {withLoading} from '../../../../shared/helpers/operators';
import {Router} from '@angular/router';
import {EDIT_PARCEL} from '../../../../shared/constants/endpoints';
import {prefixUrl} from '../../../../shared/helpers/url.helper';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-parcel-item',
  templateUrl: './parcel-item.component.html',
  styleUrls: ['./parcel-item.component.scss']
})
export class ParcelItemComponent implements OnInit {

  @Input() parcel: Parcel;
  @Output() parcelDeleted = new EventEmitter<Parcel>();
  parcelStatuses = ParcelStatusEnum;

  copiedSuccessMsg = 'Successfully copied the tracking url to clipboard.';
  copiedErrorMsg = 'Something went wrong while copying the tracking url to the clipboard';
  copiedMissingUrlMsg = '';

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
    additionalInfo: faClipboardList
  };

  faIconStyle = {
    width: '20px',
    height: '20px'
  };

  constructor(private dialog: MatDialog, private parcelService: ParcelService, private dashboardLoadingService: DashboardLoadingService,
              private router: Router, private snackBar: MatSnackBar, private clipboard: Clipboard) {
  }

  ngOnInit() {
  }

  onParcelDeleteClick() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {toDelete: this.parcel.title},
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
      .pipe(withLoading(this.dashboardLoadingService.loading$))
      .subscribe(value => {
        this.parcelDeleted.emit(this.parcel);
      }, error => {
      });
  }

  onEditParcelClick() {
    this.router.navigateByUrl(EDIT_PARCEL(this.parcel.id));
  }

  onShareParcelClick() {
    const trackingUrl = this.parcel.trackingUrl;
    // Construct the snackbar message and copy the tracking url if its present.
    let message;
    if (trackingUrl) {
      let copied = this.clipboard.copy(trackingUrl);
      message = copied ? this.copiedSuccessMsg : this.copiedErrorMsg;
    } else {
      message = this.copiedMissingUrlMsg;
    }

    // Display the snackbar message.
    this.snackBar.open(message, 'OK', {duration: 2500});
  }

  goToTrackingUrl() {
    const trackingUrl = this.parcel.trackingUrl;
    if (trackingUrl) {
      window.open(prefixUrl(trackingUrl), '_blank');
    }
  }

}
