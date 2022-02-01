import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {ChangeDetectorRef, NO_ERRORS_SCHEMA} from '@angular/core';
import {EditParcelComponent} from './edit-parcel.component';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {ParcelService} from '../../../../shared/services/parcel/parcel.service';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {Location} from '@angular/common';
import {FormControl} from '@angular/forms';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {of, Subject, throwError} from 'rxjs';
import {PARCEL_FORM_KEYS} from '../../components/parcel-form/parcel.form';
import {ApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';
import {FormComponentStub} from '../../../../testing/form.component.stub';
import {ParcelFormComponentStub} from '../../../../testing/parcel-form.component.stub';

describe('EditParcelComponent', () => {

  let parcelServiceSpy: jasmine.SpyObj<ParcelService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let dashboardLoadingServiceSpy: jasmine.SpyObj<DashboardLoadingService>;
  let changeDetectorRefSpy: jasmine.SpyObj<ChangeDetectorRef>;
  let locationSpy: jasmine.SpyObj<Location>;
  let formControlSpy: jasmine.SpyObj<FormControl>;

  let component: EditParcelComponent;
  let fixture: ComponentFixture<EditParcelComponent>;

  let parcelToEdit: Parcel = {
    additionalInformation: 'Trousers',
    courier: 'ups',
    id: 23,
    lastUpdated: new Date(),
    parcelStatus: {
      id: 0,
      status: ParcelStatusEnum.ORDERED
    },
    sender: 'Amazon',
    title: 'Clothes',
    trackingUrl: 'ups.com/track/123'
  };

  beforeEach(() => {
    // Initialize spies
    parcelServiceSpy = jasmine.createSpyObj('ParcelService', ['editParcel', 'getParcel']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {paramMap: of(convertToParamMap({id: parcelToEdit.id}))});
    dashboardLoadingServiceSpy = jasmine.createSpyObj('DashboardLoadingService', [], [{loading$: new Subject()}]);
    changeDetectorRefSpy = {} as jasmine.SpyObj<ChangeDetectorRef>;
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    formControlSpy = jasmine.createSpyObj('FormControl', ['setValue']);

    // Setup spy return values necessary for constructing the component.
    parcelServiceSpy.getParcel.withArgs(parcelToEdit.id).and.returnValue(of(parcelToEdit));
  });

  beforeEach(waitForAsync(() => {
    // Configure testing module
    TestBed.configureTestingModule({
      declarations: [EditParcelComponent, ParcelFormComponentStub, FormComponentStub],
      providers: [
        {provide: ParcelService, useValue: parcelServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteSpy},
        {provide: DashboardLoadingService, useValue: dashboardLoadingServiceSpy},
        {provide: ChangeDetectorRef, useValue: changeDetectorRefSpy},
        {provide: Location, useValue: locationSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditParcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should populate parcel form and set access to true', () => {
    // Given
    spyOn(component.parcelFormComponent.formComponent, 'getFormControl').and.returnValue(formControlSpy);
    formControlSpy.setValue.calls.reset();

    // When
    component.ngAfterViewInit();

    // Then
    expect(component.hasAccess).toBeTrue();

    expect(component.parcelFormComponent.formComponent.getFormControl).toHaveBeenCalledTimes(6);

    expect(component.parcelFormComponent.formComponent.getFormControl).toHaveBeenCalledWith(PARCEL_FORM_KEYS.trackingUrl);
    expect(component.parcelFormComponent.formComponent.getFormControl).toHaveBeenCalledWith(PARCEL_FORM_KEYS.additionalInformation);
    expect(component.parcelFormComponent.formComponent.getFormControl).toHaveBeenCalledWith(PARCEL_FORM_KEYS.courier);
    expect(component.parcelFormComponent.formComponent.getFormControl).toHaveBeenCalledWith(PARCEL_FORM_KEYS.parcelStatusEnum);
    expect(component.parcelFormComponent.formComponent.getFormControl).toHaveBeenCalledWith(PARCEL_FORM_KEYS.sender);
    expect(component.parcelFormComponent.formComponent.getFormControl).toHaveBeenCalledWith(PARCEL_FORM_KEYS.title);

    expect(formControlSpy.setValue).toHaveBeenCalledWith(parcelToEdit.trackingUrl);
    expect(formControlSpy.setValue).toHaveBeenCalledWith(parcelToEdit.additionalInformation);
    expect(formControlSpy.setValue).toHaveBeenCalledWith(parcelToEdit.courier);
    expect(formControlSpy.setValue).toHaveBeenCalledWith(parcelToEdit.parcelStatus.status);
    expect(formControlSpy.setValue).toHaveBeenCalledWith(parcelToEdit.sender);
    expect(formControlSpy.setValue).toHaveBeenCalledWith(parcelToEdit.title);
  });

  it('should set access to denied when forbidden access', () => {
    // Given
    const accessDenied: ApiErrorBody = {
      code: 403,
      error: ApiErrorEnum.access_denied,
      error_description: 'User doesn\'t have access to this parcel.'
    };

    parcelServiceSpy.getParcel.withArgs(parcelToEdit.id).and.returnValue(throwError(accessDenied));

    // When
    component.ngAfterViewInit();

    // Then
    expect(component.hasAccess).toBeFalse();
  });

  it('should set access to denied when parcel not found', () => {
    // Given
    const resourceNotFound: ApiErrorBody = {
      code: 404,
      error: ApiErrorEnum.RESOURCE_NOT_FOUND,
      error_description: 'Parcel cannot be found.'
    };

    parcelServiceSpy.getParcel.withArgs(parcelToEdit.id).and.returnValue(throwError(resourceNotFound));

    // When
    component.ngAfterViewInit();

    // Then
    expect(component.hasAccess).toBeFalse();
  });

  it('should display success message and go back to previous page after edit parcel', () => {
    // Given
    const editedParcel = parcelToEdit;
    editedParcel.id = 0;
    editedParcel.title = 'Different Clothes';

    const returnParcel = parcelToEdit;
    returnParcel.title = 'Different Clothes';

    parcelServiceSpy.editParcel.and.returnValue(of(returnParcel));
    spyOn(component.parcelFormComponent, 'displaySuccess').and.callFake((func) => {
      func();
    });

    // When
    component.onParcelResult(editedParcel);
    editedParcel.id = parcelToEdit.id;

    // Then
    expect(parcelServiceSpy.editParcel).toHaveBeenCalledTimes(1);
    expect(parcelServiceSpy.editParcel).toHaveBeenCalledWith(editedParcel);

    expect(component.parcelFormComponent.displaySuccess).toHaveBeenCalledTimes(1);
    expect(locationSpy.back).toHaveBeenCalledTimes(1);
  });

  it('should let parcel form component handle api error', () => {
    // Given
    const invalidArguments: ApiErrorBody = {
      code: 400,
      error: ApiErrorEnum.INVALID_ARGUMENTS,
      error_description: 'Arguments were invalid.'
    };

    parcelServiceSpy.editParcel.and.returnValue(throwError(invalidArguments));
    spyOn(component.parcelFormComponent, 'handleApiError');

    // When
    component.onParcelResult(parcelToEdit);

    // Then
    expect(component.parcelFormComponent.handleApiError).toHaveBeenCalledTimes(1);
    expect(component.parcelFormComponent.handleApiError).toHaveBeenCalledWith(invalidArguments);
  });
});
