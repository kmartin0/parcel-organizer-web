import {Component, OnInit} from '@angular/core';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Parcel} from '../../../../shared/models/parcel';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {loadingIndicator} from '../../../../shared/helpers/operators';
import {DashboardLoadingService} from '../../components/dashboard-loading.service';
import {PARCEL_FORM} from '../../../../shared/forms/parcel.form';

@Component({
  selector: 'app-edit-parcel',
  templateUrl: './edit-parcel.component.html',
  styleUrls: ['./edit-parcel.component.css']
})
export class EditParcelComponent implements OnInit {
//TODO: Edit, Create Parcel + Place forms skeletons in a folder.
  parcel: Parcel;
  hasAccess = undefined;
  parcelForm = PARCEL_FORM;

  constructor(private parcelService: ParcelService, private route: ActivatedRoute, private dashboardLoadingService: DashboardLoadingService) {
  }

  ngOnInit() {
    this.getParcel();
  }

  getParcel() {
    this.route.paramMap.pipe(
      switchMap(params => {
          return this.parcelService.getParcel(params.get('id')).pipe(loadingIndicator(this.dashboardLoadingService.loading$));
        }
      )
    ).subscribe(value => {
      this.parcel = value;
      this.hasAccess = true;
    }, error => {
      if (isApiErrorBody(error)) {
        if (error.error == ApiErrorEnum.access_denied) {
          this.hasAccess = false;
        }
      }
    });
  }
}
