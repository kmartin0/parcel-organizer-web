import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {ParcelService} from '../../../../shared/services/parcel/parcel.service';
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
import {ParcelFormComponent} from '../../components/parcel-form/parcel-form.component';
import {NgIf} from '@angular/common';
import {AccessDeniedComponent} from '../../../../shared/components/access-denied/access-denied.component';

@Component({
  selector: 'app-edit-parcel',
  templateUrl: './edit-parcel.component.html',
  styleUrls: ['./edit-parcel.component.scss'],
  animations: [trigger('form', enterLeaveTransition)],
  imports: [
    ParcelFormComponent,
    NgIf,
    AccessDeniedComponent
  ],
  standalone: true
})
export class EditParcelComponent implements AfterViewInit {

  loading$: Subject<boolean>;

  @ViewChild(ParcelFormComponent, {static: false}) private _parcelFormComponent!: ParcelFormComponent;
  private _hasAccess?: boolean;
  private parcelToEdit?: Parcel;

  constructor(private parcelService: ParcelService, private route: ActivatedRoute, private dashboardLoadingService: DashboardLoadingService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.loading$ = dashboardLoadingService.loading$;
  }

  get hasAccess(): boolean | undefined {
    return this._hasAccess;
  }


  set hasAccess(value: boolean | undefined) {
    this._hasAccess = value;
    this.changeDetectorRef.detectChanges();
  }

  get parcelFormComponent(): ParcelFormComponent {
    return this._parcelFormComponent;
  }

  ngAfterViewInit() {
    this.getParcelToEdit();
  }

  onParcelResult(parcel: Parcel) {
    if (this.parcelToEdit) {
      parcel.id = this.parcelToEdit.id;

      this.parcelService.editParcel(parcel).pipe(
        withLoading(this.loading$),
      ).subscribe(_ => {
        this.handleEditSuccess();
      }, error => {
        this.parcelFormComponent.handleApiError(error);
      });
    }
  }

  private handleEditSuccess() {
    this.parcelFormComponent.displaySuccess();
  }

  private getParcelToEdit() {
    this.route.paramMap.pipe(
      switchMap(params => {
          const parcelId = Number(params.get('id')) || NaN;

          if (isNaN(parcelId)) {
            throw new Error('Invalid Parcel ID.');
          }
          return this.parcelService.getParcel(parcelId).pipe(withLoading(this.loading$));
        }
      )
    ).subscribe(parcel => {
      this.hasAccess = true;
      this.parcelToEdit = parcel;
      this.populateForm(parcel);
    }, error => {
      if (isApiErrorBody(error)) {
        if (error.error === ApiErrorEnum.access_denied || error.error === ApiErrorEnum.RESOURCE_NOT_FOUND) {
          this.hasAccess = false;
        }
      }
    });
  }

  private populateForm(parcel: Parcel) {
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.title).setValue(parcel.title);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.sender).setValue(parcel.sender);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.courier).setValue(parcel.courier);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.trackingUrl).setValue(parcel.trackingUrl);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.additionalInformation).setValue(parcel.additionalInformation);
    this.parcelFormComponent.formComponent.getFormControl(PARCEL_FORM_KEYS.parcelStatusEnum).setValue(parcel.parcelStatus?.status);
  }
}
