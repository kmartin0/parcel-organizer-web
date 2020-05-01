import {AfterViewInit, Component} from '@angular/core';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../../../shared/anim/enter-leave.anim';
import {Parcel} from '../../../../shared/models/parcel';
import {PARCEL_FORM, PARCEL_FORM_KEYS} from './parcel.form';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {ParcelStatus} from '../../../../shared/models/parcel-status';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {withLoading} from '../../../../shared/helpers/operators';
import {BaseFormComponent} from '../../../../shared/components/dynamic-form/base-form.component';

@Component({
  selector: 'app-parcel-form',
  templateUrl: './parcel-form.component.html',
  styleUrls: ['./parcel-form.component.scss'],
  animations: [trigger('form', enterLeaveTransition)]
})
export class ParcelFormComponent extends BaseFormComponent<Parcel> implements AfterViewInit {

  previewParcel: Parcel;

  constructor(private parcelService: ParcelService) {
    super();
    this.initPreviewParcel();
  }

  get form() {
    return PARCEL_FORM;
  }

  ngAfterViewInit(): void {
    this.initFormObserver();
  }

  onValidForm(formValues: { [key: string]: string }) {
    const parcel: Parcel = new class implements Parcel {
      id: number;
      title: string = formValues[PARCEL_FORM_KEYS.title];
      sender: string = formValues[PARCEL_FORM_KEYS.sender];
      courier: string = formValues[PARCEL_FORM_KEYS.courier];
      trackingUrl: string = formValues[PARCEL_FORM_KEYS.trackingUrl];
      additionalInformation: string = formValues[PARCEL_FORM_KEYS.additionalInformation];
      parcelStatus: ParcelStatus;
      lastUpdated: Date;
    };
    this.parcelService.getParcelStatus(formValues[PARCEL_FORM_KEYS.parcelStatusEnum] as ParcelStatusEnum).pipe(
      withLoading(this.loading$)
    ).subscribe(parcelStatus => {
      parcel.parcelStatus = parcelStatus;
      this.validFormResult$.emit(parcel);
    }, error => {
      this.handleApiError(error);
    });
  }

  handleApiError(apiError: any) {
    if (isApiErrorBody(apiError)) {
      switch (apiError.error) {
        case ApiErrorEnum.INVALID_ARGUMENTS: {
          this.formComponent.setError(PARCEL_FORM_KEYS.title, apiError.details[PARCEL_FORM_KEYS.title]);
          this.formComponent.setError(PARCEL_FORM_KEYS.sender, apiError.details[PARCEL_FORM_KEYS.sender]);
          this.formComponent.setError(PARCEL_FORM_KEYS.courier, apiError.details[PARCEL_FORM_KEYS.courier]);
          this.formComponent.setError(PARCEL_FORM_KEYS.trackingUrl, apiError.details[PARCEL_FORM_KEYS.trackingUrl]);
          this.formComponent.setError(PARCEL_FORM_KEYS.additionalInformation, apiError.details[PARCEL_FORM_KEYS.additionalInformation]);
          this.formComponent.setError(PARCEL_FORM_KEYS.parcelStatusEnum, apiError.details[PARCEL_FORM_KEYS.parcelStatusEnum]);
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

  resetForm() {
    this.formComponent.resetForm(
      {
        [PARCEL_FORM_KEYS.parcelStatusEnum]: this.form.find(value => value.key == PARCEL_FORM_KEYS.parcelStatusEnum).value
      }
    );
  }

  private initPreviewParcel() {
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
      additionalInformation: string = '';
    };
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
        case PARCEL_FORM_KEYS.additionalInformation: {
          this.previewParcel.additionalInformation = next.value;
          break;
        }
        case PARCEL_FORM_KEYS.parcelStatusEnum: {
          this.previewParcel.parcelStatus.status = ParcelStatusEnum[next.value];
          break;
        }
      }
    });
  }
}
