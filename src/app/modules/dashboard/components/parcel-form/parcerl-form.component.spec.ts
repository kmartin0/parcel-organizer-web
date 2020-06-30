import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {ParcelFormComponent} from './parcel-form.component';
import {ParcelService} from '../../../../shared/services/parcel/parcel.service';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Observable, of, Subject, throwError} from 'rxjs';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {PARCEL_FORM_KEYS} from './parcel.form';
import {ApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';

describe('ParcelFormComponent', () => {

  let valueChanges$ = new Subject<{ key: string, value: string }>();
  let parcelServiceSpy: jasmine.SpyObj<ParcelService>;
  let component: ParcelFormComponent;
  let fixture: ComponentFixture<ParcelFormComponent>;

  @Component({
    selector: 'app-form',
    template: '',
    providers: [{provide: FormComponent, useClass: FormComponentStub}]
  })
  class FormComponentStub {
    setError(formControlKey: string, error: string) {
    };

    get valueChanges$(): Observable<{ key: string, value: string }> {
      return valueChanges$;
    }

    resetForm(value?: any) {
    }
  }

  beforeEach(() => {
    // Initialize spies
    parcelServiceSpy = jasmine.createSpyObj('ParcelService', ['getParcelStatus']);
  })

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [ParcelFormComponent, FormComponentStub],
      providers: [{provide: ParcelService, useValue: parcelServiceSpy}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize preview parcel', () => {
    expect(component.previewParcel).toBeTruthy();
  });

  it('should update preview parcel when form input is given.', () => {
    // Given
    const parcel: Parcel = {
      additionalInformation: 'Extra info',
      courier: 'UPS',
      id: undefined,
      lastUpdated: undefined,
      parcelStatus: {
        id: 0,
        status: ParcelStatusEnum.SENT
      },
      sender: 'Amazon',
      title: 'Stuff',
      trackingUrl: 'amazon.com/tracker/10'
    };

    // When
    valueChanges$.next({key: PARCEL_FORM_KEYS.additionalInformation, value: parcel.additionalInformation});
    valueChanges$.next({key: PARCEL_FORM_KEYS.courier, value: parcel.courier});
    valueChanges$.next({key: PARCEL_FORM_KEYS.parcelStatusEnum, value: parcel.parcelStatus.status});
    valueChanges$.next({key: PARCEL_FORM_KEYS.sender, value: parcel.sender});
    valueChanges$.next({key: PARCEL_FORM_KEYS.title, value: parcel.title});
    valueChanges$.next({key: PARCEL_FORM_KEYS.trackingUrl, value: parcel.trackingUrl});

    // Then
    expect(component.previewParcel).toEqual(jasmine.objectContaining({
      additionalInformation: parcel.additionalInformation,
      courier: parcel.courier,
      parcelStatus: jasmine.objectContaining({
        status: parcel.parcelStatus.status
      }),
      sender: parcel.sender,
      title: parcel.title,
      trackingUrl: parcel.trackingUrl
    }));
  });

  it('should fetch parcel status from api when a valid form is submitted and emit the Parcel object', () => {
    // Given
    parcelServiceSpy.getParcelStatus.and.returnValue(of({status: ParcelStatusEnum.SENT, id: 2}));
    spyOn(component.validFormResult$, 'emit');

    const parcel: Parcel = {
      additionalInformation: 'Extra info',
      courier: 'UPS',
      id: undefined,
      lastUpdated: undefined,
      parcelStatus: {
        id: 0,
        status: ParcelStatusEnum.SENT
      },
      sender: 'Amazon',
      title: 'Stuff',
      trackingUrl: 'amazon.com/tracker/10'
    };

    const submittedForm = {
      [PARCEL_FORM_KEYS.trackingUrl]: parcel.trackingUrl,
      [PARCEL_FORM_KEYS.parcelStatusEnum]: parcel.parcelStatus.status,
      [PARCEL_FORM_KEYS.courier]: parcel.courier,
      [PARCEL_FORM_KEYS.additionalInformation]: parcel.additionalInformation,
      [PARCEL_FORM_KEYS.sender]: parcel.sender,
      [PARCEL_FORM_KEYS.title]: parcel.title,
    };

    // When
    component.onValidForm(submittedForm);

    // Change parcel status id to the expected id.
    parcel.parcelStatus.id = 2;

    // Then
    expect(parcelServiceSpy.getParcelStatus).toHaveBeenCalledTimes(1);
    expect(parcelServiceSpy.getParcelStatus).toHaveBeenCalledWith(parcel.parcelStatus.status);
    expect(component.validFormResult$.emit).toHaveBeenCalledTimes(1);
    expect(component.validFormResult$.emit).toHaveBeenCalledWith(parcel);
  });

  it('should handle api error when get parcel status throws an error', () => {
    // Given
    const invalidArgumentError: ApiErrorBody = {
      code: 400,
      error: ApiErrorEnum.INVALID_ARGUMENTS,
      description: 'An error occurred',
    };

    parcelServiceSpy.getParcelStatus.and.returnValue(throwError(invalidArgumentError));
    spyOn(component, 'handleApiError');

    // When
    component.onValidForm({});

    // Then
    expect(component.handleApiError).toHaveBeenCalledTimes(1);
    expect(component.handleApiError).toHaveBeenCalledWith(invalidArgumentError);
  });

  it('should reset form with the initial value from parcel form', () => {
    // Given
    spyOn(component.formComponent, 'resetForm');

    // When
    component.resetForm();

    // Then
    expect(component.formComponent.resetForm).toHaveBeenCalledTimes(1);
    expect(component.formComponent.resetForm).toHaveBeenCalledWith({parcelStatus: ParcelStatusEnum.ORDERED});
  });

  it('should handle invalid arguments', () => {
    // Given
    const invalidMsg = 'Too Long';

    const invalidArgumentError: ApiErrorBody = {
      code: 400,
      error: ApiErrorEnum.INVALID_ARGUMENTS,
      description: 'Invalid Arguments Supplied',
      details: {
        [PARCEL_FORM_KEYS.title]: invalidMsg,
        [PARCEL_FORM_KEYS.sender]: invalidMsg,
        [PARCEL_FORM_KEYS.additionalInformation]: invalidMsg,
        [PARCEL_FORM_KEYS.courier]: invalidMsg,
        [PARCEL_FORM_KEYS.parcelStatusEnum]: invalidMsg,
        [PARCEL_FORM_KEYS.trackingUrl]: invalidMsg,
      }
    };

    spyOn(component.formComponent, 'setError');

    // When
    component.handleApiError(invalidArgumentError);

    // Then
    expect(component.formComponent.setError).toHaveBeenCalledTimes(6);

    expect(component.formComponent.setError).toHaveBeenCalledWith(PARCEL_FORM_KEYS.title, invalidMsg);
    expect(component.formComponent.setError).toHaveBeenCalledWith(PARCEL_FORM_KEYS.sender, invalidMsg);
    expect(component.formComponent.setError).toHaveBeenCalledWith(PARCEL_FORM_KEYS.additionalInformation, invalidMsg);
    expect(component.formComponent.setError).toHaveBeenCalledWith(PARCEL_FORM_KEYS.courier, invalidMsg);
    expect(component.formComponent.setError).toHaveBeenCalledWith(PARCEL_FORM_KEYS.parcelStatusEnum, invalidMsg);
    expect(component.formComponent.setError).toHaveBeenCalledWith(PARCEL_FORM_KEYS.trackingUrl, invalidMsg);
  });

  it('should handle resource not found', () => {
    // Given
    const resourceNotFoundBody: ApiErrorBody = {
      code: 404,
      error: ApiErrorEnum.RESOURCE_NOT_FOUND,
      description: 'Resource with id 1 could not be found.',
    };

    spyOn(component.formComponent, 'setError');

    // When
    component.handleApiError(resourceNotFoundBody);

    // Then
    expect(component.formComponent.setError).toHaveBeenCalledTimes(1);
    expect(component.formComponent.setError).toHaveBeenCalledWith(null, jasmine.any(String));
  });

  it('should handle api unknown errors', () => {
    // Given
    const unknownErrorBody = {
      code: 403,
      error: 'Something else happened',
    };

    spyOn(component.formComponent, 'setError');

    // When
    component.handleApiError(unknownErrorBody);

    // Then
    expect(component.formComponent.setError).toHaveBeenCalledTimes(1);
    expect(component.formComponent.setError).toHaveBeenCalledWith(null, jasmine.any(String));
  });

});
