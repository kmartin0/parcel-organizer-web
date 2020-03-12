import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Parcel} from '../../../../shared/models/parcel';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {loadingIndicator} from '../../../../shared/helpers/operators';
import {DashboardLoadingService} from '../../components/dashboard-loading.service';
import {PARCEL_FORM_KEYS} from '../../../../shared/forms/parcel.form';
import {Subject} from 'rxjs';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../../../shared/anim/enter-leave.anim';
import {Location} from '@angular/common';
import {ParcelFormComponent} from '../../components/parcel-form/parcel-form.component';

@Component({
  selector: 'app-edit-parcel',
  templateUrl: './edit-parcel.component.html',
  styleUrls: ['./edit-parcel.component.css'],
  animations: [trigger('form', enterLeaveTransition)]
})
export class EditParcelComponent implements OnInit {

  loading$ = new Subject<boolean>();
  parcelToEdit: Parcel;
  hasAccess = undefined;

  @ViewChild(ParcelFormComponent, {static: false}) private _parcelFormComponent: ParcelFormComponent;
  get parcelFormComponent(): ParcelFormComponent {
    return this._parcelFormComponent;
  }

  constructor(private parcelService: ParcelService, private route: ActivatedRoute, private dashboardLoadingService: DashboardLoadingService,
              private changeDetectorRef: ChangeDetectorRef, private location: Location) {
  }

  ngOnInit() {
    this.getParcelToEdit();
  }

  getParcelToEdit() {
    this.route.paramMap.pipe(
      switchMap(params => {
          return this.parcelService.getParcel(params.get('id')).pipe(loadingIndicator(this.dashboardLoadingService.loading$));
        }
      )
    ).subscribe(parcel => {
      this.setAccess(true);
      this.parcelToEdit = parcel;
      this.populateForm(parcel);
    }, error => {
      if (isApiErrorBody(error)) {
        if (error.error == ApiErrorEnum.access_denied) {
          this.setAccess(false);
        }
      }
    });
  }

  populateForm(parcel: Parcel) {
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.title).setValue(parcel.title);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.sender).setValue(parcel.sender);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.courier).setValue(parcel.courier);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.trackingUrl).setValue(parcel.trackingUrl);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.parcelStatusEnum).setValue(parcel.parcelStatus.status);
  }

  onParcelResult(parcel: Parcel) {
    parcel.id = this.parcelToEdit.id;

    this.parcelService.editParcel(parcel).pipe(
      loadingIndicator(this.loading$),
      loadingIndicator(this.dashboardLoadingService.loading$)
    ).subscribe(parcel => {
      this.handleEditSuccess();
    }, error => {
      this.parcelFormComponent.handleParcelApiError(error);
    });
  }

  private handleEditSuccess() {
    this.parcelFormComponent.displaySuccess(() => {
      this.location.back();
    });
  }

  setAccess(access: boolean) {
    this.hasAccess = access;
    this.changeDetectorRef.detectChanges();
  }
}
