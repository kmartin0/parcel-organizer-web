import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {ParcelsComponent} from './parcels.component';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {of, Subject, throwError} from 'rxjs';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';

describe('ParcelsComponent', () => {

  let parcelServiceSpy: jasmine.SpyObj<ParcelService>;
  let dashboardLoadingServiceSpy: jasmine.SpyObj<DashboardLoadingService>;
  let scrollDispatcherSpy: jasmine.SpyObj<ScrollDispatcher>;

  let component: ParcelsComponent;
  let fixture: ComponentFixture<ParcelsComponent>;

  let parcels: Array<Parcel> = new Array<Parcel>(
    {
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
    },
    {
      additionalInformation: 'Jacket',
      courier: 'dhl',
      id: 24,
      lastUpdated: new Date(),
      parcelStatus: {
        id: 1,
        status: ParcelStatusEnum.SENT
      },
      sender: 'Bol',
      title: 'Stuff',
      trackingUrl: 'dhl.com/track/123'
    }
  );

  beforeEach(() => {
    // Initialize spies
    parcelServiceSpy = jasmine.createSpyObj('ParcelService', ['getParcels']);
    dashboardLoadingServiceSpy = jasmine.createSpyObj('DashboardLoadingService', [], [{loading$: new Subject()}]);
    scrollDispatcherSpy = jasmine.createSpyObj('ScrollDispatcher', ['scrollContainers']);

    // Setup spy return values necessary for constructing the component.
    parcelServiceSpy.getParcels.and.returnValue(of(parcels));
  });

  beforeEach(async(() => {
    // Configure testing module
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [ParcelsComponent],
      providers: [
        {provide: ParcelService, useValue: parcelServiceSpy},
        {provide: DashboardLoadingService, useValue: dashboardLoadingServiceSpy},
        {provide: ScrollDispatcher, useValue: scrollDispatcherSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add parcels to parcels$ and set parcels fetched state to true', () => {
    expect(component.parcelsFetched).toBeTrue();
    expect(component.parcels$.getValue()).toEqual(parcels);
  });

  it('should set parcels fetched state to true when an error is returned', () => {
    // Given
    const apiError: ApiErrorBody = {
      code: 500,
      description: 'Something went wrong',
      error: ApiErrorEnum.INTERNAL
    };
    component.parcelsFetched = false;

    parcelServiceSpy.getParcels.and.returnValue(throwError(apiError));

    // When
    component.ngOnInit();

    // Then
    expect(component.parcelsFetched).toBeTrue();
  });

  it('should set new page in paging config and scroll to top on page change', () => {
    // Given
    const expectedPagingConfig = component.pagingConfig$.getValue();
    expectedPagingConfig.curPage = 3;

    spyOn(component, 'scrollTop');

    // When
    component.onPageChange(3);

    // Then
    expect(component.pagingConfig$.getValue()).toEqual(expectedPagingConfig);
    expect(component.scrollTop).toHaveBeenCalledTimes(1);
  });

  it('should remove parcel from the parcels list', () => {
    // Given
    const parcelToDelete = parcels[0];
    const expectedParcels = parcels.slice(1, parcels.length);

    // When
    component.onParcelDeleted(parcelToDelete);

    // Then
    expect(component.parcels$.getValue()).toEqual(expectedParcels);

  });

});
