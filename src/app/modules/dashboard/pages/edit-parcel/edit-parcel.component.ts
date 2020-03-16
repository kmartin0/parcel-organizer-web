import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Parcel} from '../../../../shared/models/parcel';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {withLoading} from '../../../../shared/helpers/operators';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {PARCEL_FORM_KEYS} from '../../components/parcel-form/parcel.form';
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

  loading$: Subject<boolean>;

  @ViewChild(ParcelFormComponent, {static: false}) private _parcelFormComponent: ParcelFormComponent;
  private _hasAccess: boolean = undefined;
  private parcelToEdit: Parcel;

  constructor(private parcelService: ParcelService, private route: ActivatedRoute, private dashboardLoadingService: DashboardLoadingService,
              private changeDetectorRef: ChangeDetectorRef, private location: Location) {
    this.loading$ = dashboardLoadingService.loading$;
  }

  get hasAccess(): boolean {
    return this._hasAccess;
  }

  set hasAccess(value: boolean) {
    this._hasAccess = value;
    this.changeDetectorRef.detectChanges();
  }

  get parcelFormComponent(): ParcelFormComponent {
    return this._parcelFormComponent;
  }

  ngOnInit() {
    this.getParcelToEdit();
  }

  populateForm(parcel: Parcel) {
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.title).setValue(parcel.title);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.sender).setValue(parcel.sender);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.courier).setValue(parcel.courier);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.trackingUrl).setValue(parcel.trackingUrl);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.additionalInformation).setValue(parcel.additionalInformation);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.parcelStatusEnum).setValue(parcel.parcelStatus.status);
  }

  onParcelResult(parcel: Parcel) {
    parcel.id = this.parcelToEdit.id;

    this.parcelService.editParcel(parcel).pipe(
      withLoading(this.loading$),
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

  private getParcelToEdit() {
    this.route.paramMap.pipe(
      switchMap(params => {
          return this.parcelService.getParcel(params.get('id')).pipe(withLoading(this.loading$));
        }
      )
    ).subscribe(parcel => {
      this.hasAccess = true;
      this.parcelToEdit = parcel;
      this.populateForm(parcel);
    }, error => {
      if (isApiErrorBody(error)) {
        if (error.error == ApiErrorEnum.access_denied || error.error == ApiErrorEnum.RESOURCE_NOT_FOUND) {
          this.hasAccess = false;
        }
      }
    });
  }
}
