import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {of, Subject, throwError} from 'rxjs';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ParcelFormComponent} from '../../components/parcel-form/parcel-form.component';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {CreateParcelComponent} from './create-parcel.component';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';

describe('CreateParcelComponent', () => {

  let dashboardLoadingServiceSpy: jasmine.SpyObj<DashboardLoadingService>;
  let parcelServiceSpy: jasmine.SpyObj<ParcelService>;

  let component: CreateParcelComponent;
  let fixture: ComponentFixture<CreateParcelComponent>;

  @Component({
    selector: 'app-parcel-form',
    template: '',
    providers: [{provide: ParcelFormComponent, useClass: ParcelFormComponentStub}],
  })
  class ParcelFormComponentStub {
    displaySuccess(callback?: () => void) {
      callback();
    }

    resetForm(value?: any) {
    }

    handleApiError(apiError: any) {
    }
  }

  beforeEach(() => {
    // Initialize spies
    dashboardLoadingServiceSpy = jasmine.createSpyObj('DashboardLoadingService', [], [{loading$: new Subject()}]);
    parcelServiceSpy = jasmine.createSpyObj('ParcelService', ['createParcel']);
  })

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [CreateParcelComponent, ParcelFormComponentStub],
      providers: [
        {provide: ParcelService, useValue: parcelServiceSpy},
        {provide: DashboardLoadingService, useValue: dashboardLoadingServiceSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateParcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display success and reset form when parcel is created.', () => {
    // Given
    const parcelInput: Parcel = {
      additionalInformation: 'additional',
      courier: 'dps',
      id: 2,
      lastUpdated: undefined,
      parcelStatus: {status: ParcelStatusEnum.ORDERED, id: 1},
      sender: 'amazon',
      title: 'clothes',
      trackingUrl: undefined
    };

    const parcelResult: Parcel = {
      additionalInformation: 'additional',
      courier: 'dps',
      id: 2,
      lastUpdated: new Date(),
      parcelStatus: {status: ParcelStatusEnum.ORDERED, id: 1},
      sender: 'amazon',
      title: 'clothes',
      trackingUrl: undefined
    };

    parcelServiceSpy.createParcel.and.returnValue(of(parcelResult));
    spyOn(component.parcelFormComponent, 'displaySuccess').and.callThrough();
    spyOn(component.parcelFormComponent, 'resetForm');

    // When
    component.onParcelResult(parcelInput);

    // Then
    expect(component.parcelFormComponent.displaySuccess).toHaveBeenCalledTimes(1);
    expect(component.parcelFormComponent.resetForm).toHaveBeenCalledTimes(1);
    expect(component.parcelFormComponent.resetForm).toHaveBeenCalledWith();
  });

  it('should let parcel form component handle api error', () => {
    // Given
    const parcelInput: Parcel = {
      additionalInformation: 'additional',
      courier: 'dps',
      id: 2,
      lastUpdated: undefined,
      parcelStatus: {status: ParcelStatusEnum.ORDERED, id: 1},
      sender: 'amazon',
      title: 'clothes',
      trackingUrl: undefined
    };

    const errorMsg = {error: 'error'};
    parcelServiceSpy.createParcel.and.returnValue(throwError(errorMsg));
    spyOn(component.parcelFormComponent, 'handleApiError');

    // When
    component.onParcelResult(parcelInput);

    // Then
    expect(component.parcelFormComponent.handleApiError).toHaveBeenCalledTimes(1);
    expect(component.parcelFormComponent.handleApiError).toHaveBeenCalledWith(errorMsg);
  });

});
