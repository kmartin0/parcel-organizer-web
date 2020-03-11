import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Parcel} from '../../../../shared/models/parcel';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {loadingIndicator} from '../../../../shared/helpers/operators';
import {DashboardLoadingService} from '../../components/dashboard-loading.service';
import {PARCEL_FORM, PARCEL_FORM_KEYS} from '../../../../shared/forms/parcel.form';
import {Subject} from 'rxjs';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../../../shared/anim/enter-leave.anim';
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-parcel',
  templateUrl: './edit-parcel.component.html',
  styleUrls: ['./edit-parcel.component.css'],
  animations: [trigger('form', enterLeaveTransition)]
})
export class EditParcelComponent implements OnInit, AfterViewInit {

  loading$ = new Subject<boolean>();
  parcel: Parcel;
  hasAccess = undefined;
  parcelForm = PARCEL_FORM;

  @ViewChild(FormComponent, {static: false}) private _formComponent: FormComponent;
  get formComponent(): FormComponent {
    return this._formComponent;
  }

  constructor(private parcelService: ParcelService, private route: ActivatedRoute, private dashboardLoadingService: DashboardLoadingService,
              private changeDetectorRef: ChangeDetectorRef, private location: Location) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getParcel();
  }

  getParcel() {
    this.route.paramMap.pipe(
      switchMap(params => {
          return this.parcelService.getParcel(params.get('id')).pipe(loadingIndicator(this.dashboardLoadingService.loading$));
        }
      )
    ).subscribe(value => {
      this.setAccess(true);
      this.parcel = value;
      this.populateForm(value);
    }, error => {
      if (isApiErrorBody(error)) {
        if (error.error == ApiErrorEnum.access_denied) {
          this.setAccess(false);
        }
      }
    });
  }

  populateForm(parcel: Parcel) {
    this.formComponent.getFormControl(PARCEL_FORM_KEYS.title).setValue(parcel.title);
    this.formComponent.getFormControl(PARCEL_FORM_KEYS.sender).setValue(parcel.sender);
    this.formComponent.getFormControl(PARCEL_FORM_KEYS.courier).setValue(parcel.courier);
    this.formComponent.getFormControl(PARCEL_FORM_KEYS.trackingUrl).setValue(parcel.trackingUrl);
    this.formComponent.getFormControl(PARCEL_FORM_KEYS.parcelStatusEnum).setValue(parcel.parcelStatus.status);
  }

  onValidForm(formValues: any) {
    this.parcelService.getParcelStatus(formValues[PARCEL_FORM_KEYS.parcelStatusEnum]).pipe(
      loadingIndicator(this.loading$),
      loadingIndicator(this.dashboardLoadingService.loading$),
      switchMap(parcelStatus => {
        const newParcel = this.parcel;
        newParcel.title = formValues[PARCEL_FORM_KEYS.title];
        newParcel.sender = formValues[PARCEL_FORM_KEYS.sender];
        newParcel.courier = formValues[PARCEL_FORM_KEYS.courier];
        newParcel.trackingUrl = formValues[PARCEL_FORM_KEYS.trackingUrl];
        newParcel.parcelStatus = parcelStatus;

        return this.parcelService.editParcel(newParcel);
      })
    ).subscribe(parcel => {
      this.handleEditSuccess(parcel);
    }, error => {
      this.handleEditError(error);
    });
  }

  private handleEditSuccess(parcel: Parcel) {
    this.formComponent.displaySuccess(() => {
      this.location.back();
    });
  }

  private handleEditError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      switch (apiError.error) {
        case ApiErrorEnum.INVALID_ARGUMENTS: {
          this.formComponent.setError(PARCEL_FORM_KEYS.title, apiError.details['title']);
          this.formComponent.setError(PARCEL_FORM_KEYS.sender, apiError.details['sender']);
          this.formComponent.setError(PARCEL_FORM_KEYS.courier, apiError.details['courier']);
          this.formComponent.setError(PARCEL_FORM_KEYS.trackingUrl, apiError.details['trackingUrl']);
          this.formComponent.setError(PARCEL_FORM_KEYS.parcelStatusEnum, apiError.details['parcelStatus']);
          break;
        }
        case ApiErrorEnum.RESOURCE_NOT_FOUND: {
          this.formComponent.setError(null, 'A resource could not be found. Please try again later or contact us.');
        }
      }
    } else {
      this.formComponent.setError(null, 'An unknown error has occurred.');
    }
  }

  setAccess(access: boolean) {
    this.hasAccess = access;
    this.changeDetectorRef.detectChanges();
  }
}
