import {AfterViewInit, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../../../shared/anim/enter-leave.anim';
import {Parcel} from '../../../../shared/models/parcel';
import {Subject} from 'rxjs';
import {PARCEL_FORM, PARCEL_FORM_KEYS} from '../../../../shared/forms/parcel.form';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {DashboardLoadingService} from '../dashboard-loading.service';
import {ParcelStatus} from '../../../../shared/models/parcel-status';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {loadingIndicator} from '../../../../shared/helpers/operators';

@Component({
  selector: 'app-parcel-form',
  templateUrl: './parcel-form.component.html',
  styleUrls: ['./parcel-form.component.css'],
  animations: [trigger('form', enterLeaveTransition)]
})
export class ParcelFormComponent implements AfterViewInit {

  previewParcel: Parcel;
  loading$ = new Subject<boolean>();
  parcelForm = PARCEL_FORM;
  @Output() parcelResult = new EventEmitter<Parcel>();

  @ViewChild(FormComponent, {static: false}) private _formComponent: FormComponent;
  get formComponent(): FormComponent {
    return this._formComponent;
  }

  constructor(private parcelService: ParcelService, private dashboardLoadingService: DashboardLoadingService) {
    this.previewParcel = new class implements Parcel {
      courier: string = '';
      id: number;
      lastUpdated: Date = new Date();
      parcelStatus: ParcelStatus = new class implements ParcelStatus {
        id: number = 0;
        status: ParcelStatusEnum = ParcelStatusEnum.ORDERED;
      };
      sender: string = '';
      title: string = '';
      trackingUrl: string = '';
    };
  }

  ngAfterViewInit(): void {
    this.initFormObserver();
  }

  onValidForm(formValues) {
    const parcel: Parcel = new class implements Parcel {
      id: number;
      title: string = formValues[PARCEL_FORM_KEYS.title];
      sender: string = formValues[PARCEL_FORM_KEYS.sender];
      courier: string = formValues[PARCEL_FORM_KEYS.courier];
      trackingUrl: string = formValues[PARCEL_FORM_KEYS.trackingUrl];
      parcelStatus: ParcelStatus;
      lastUpdated: Date;
    };
    this.parcelService.getParcelStatus(formValues[PARCEL_FORM_KEYS.parcelStatusEnum]).pipe(
      loadingIndicator(this.loading$),
      loadingIndicator(this.dashboardLoadingService.loading$)
    ).subscribe(parcelStatus => {
      parcel.parcelStatus = parcelStatus;
      this.parcelResult.emit(parcel);
    }, error => {
      this.handleParcelApiError(error);
    });
  }

  handleParcelApiError(apiError) {
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

  private initFormObserver() {
    this.formComponent.valueChanges$.subscribe((next: { key: string, value: string }) => {
      switch (next.key) {
        case PARCEL_FORM_KEYS.title: {
          this.previewParcel.title = next.value;
          break;
        }
        case PARCEL_FORM_KEYS.sender: {
          this.previewParcel.sender = next.value;
          break;
        }
        case PARCEL_FORM_KEYS.courier: {
          this.previewParcel.courier = next.value;
          break;
        }
        case PARCEL_FORM_KEYS.trackingUrl: {
          this.previewParcel.trackingUrl = next.value;
          break;
        }
        case PARCEL_FORM_KEYS.parcelStatusEnum: {
          this.previewParcel.parcelStatus.status = ParcelStatusEnum[next.value];
          break;
        }
      }
    });
  }

  displaySuccess(callback?: () => void) {
    this.formComponent.displaySuccess(() => {
      if (callback) {
        callback();
      }
    });
  }

  resetForm() {
    this.formComponent.resetForm({[PARCEL_FORM_KEYS.parcelStatusEnum]: this.parcelForm[4].value});
  }

}
