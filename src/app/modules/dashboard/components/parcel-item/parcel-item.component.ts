import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {
  faBoxOpen,
  faClipboardList,
  faClock,
  faMoneyCheckAlt,
  faPen,
  faShareAlt,
  faShippingFast,
  faShoppingBag,
  faTrash,
  faTruck
} from '@fortawesome/free-solid-svg-icons';
import {DeleteDialogComponent} from '../../../../shared/components/dialogs/delete-dialog/delete-dialog.component';
import {ParcelService} from '../../../../shared/services/parcel/parcel.service';
import {DashboardLoadingService} from '../../pages/dashboard/dashboard-loading.service';
import {withLoading} from '../../../../shared/helpers/operators';
import {Router} from '@angular/router';
import {EDIT_PARCEL} from '../../../../shared/constants/endpoints';
import {UrlHelperService} from '../../../../shared/services/url/url.helper.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard';
import {DatePipe, NgClass, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-parcel-item',
  templateUrl: './parcel-item.component.html',
  styleUrls: ['./parcel-item.component.scss'],
  imports: [
    NgIf,
    NgClass,
    FontAwesomeModule,
    NgSwitchCase,
    NgSwitch,
    MatTooltip,
    DatePipe
  ],
  standalone: true
})
export class ParcelItemComponent implements OnInit {

  @Input() parcel?: Parcel;
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
              private router: Router, private snackBar: MatSnackBar, private clipboard: Clipboard, private urlHelper: UrlHelperService) {
  }

  ngOnInit() {
  }

  onParcelDeleteClick() {
    if (this.parcel) {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {toDelete: this.parcel?.title},
        panelClass: 'app-dialog'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteParcel();
        }
      });
    }
  }

  deleteParcel() {
    if (this.parcel && this.parcel.id) {
      this.parcelService.deleteParcel(this.parcel.id)
        .pipe(withLoading(this.dashboardLoadingService.loading$))
        .subscribe(value => {
          this.parcelDeleted.emit(this.parcel);
        }, error => {
        });
    }
  }

  onEditParcelClick() {
    if (this.parcel && this.parcel.id) this.router.navigateByUrl(EDIT_PARCEL(this.parcel.id));
  }

  onShareParcelClick() {
    if (this.parcel) {
      const trackingUrl = this.parcel.trackingUrl;
      // Construct the snackbar message and copy the tracking url if its present.
      let message;
      if (trackingUrl) {
        const copied = this.clipboard.copy(trackingUrl);
        message = copied ? this.copiedSuccessMsg : this.copiedErrorMsg;
      } else {
        message = this.copiedMissingUrlMsg;
      }

      // Display the snackbar message.
      this.snackBar.open(message, 'OK', {duration: 2500});
    }
  }

  goToTrackingUrl() {
    if (this.parcel) {
      const trackingUrl = this.parcel.trackingUrl;
      if (trackingUrl) {
        window.open(this.urlHelper.prefixUrl(trackingUrl), '_blank');
      }
    }
  }

}
