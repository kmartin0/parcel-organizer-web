import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ParcelFilterFormComponent} from './parcel-filter-form.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {
  ParcelOrderDirectionEnum,
  ParcelOrderOptionsEnum,
  ParcelSearchOptionsEnum,
  ParcelsSortFilterConfig
} from './parcels-sort-filter-config';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {ParcelFilterFormCacheService} from '../../pages/parcels/parcel-filter-form-cache.service';

describe('ParcelFilterFormComponent', () => {

  let parcelFilterFormCacheServiceSpy: jasmine.SpyObj<ParcelFilterFormCacheService>;
  let component: ParcelFilterFormComponent;
  let fixture: ComponentFixture<ParcelFilterFormComponent>;

  beforeEach(() => {
    // Initialize spies
    parcelFilterFormCacheServiceSpy = jasmine.createSpyObj('ParcelFilterFormCacheService', ['persistParcelFilters', 'getCachedParcelFilters']);
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ParcelFilterFormComponent, BrowserAnimationsModule],
      declarations: [],
      providers: [{provide: ParcelFilterFormCacheService, useValue: parcelFilterFormCacheServiceSpy}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit current sort and filter settings when the values change', () => {

    // Given
    const emitSpy = spyOn(component.sortFilterConfigEmitter, 'emit');

    const keys = component.filterFormKeys;

    const expected: ParcelsSortFilterConfig = {
      orderBy: ParcelOrderOptionsEnum.SENDER,
      orderDirection: ParcelOrderDirectionEnum.ASCENDING,
      searchBy: ParcelSearchOptionsEnum.COURIER,
      searchQuery: 'Packets',
      statusFilters: [ParcelStatusEnum.ORDERED, ParcelStatusEnum.SENT]
    };

    // When
    component.filterForm.get(keys.search)?.setValue(expected.searchQuery);
    component.filterForm.get(keys.searchBy)?.setValue(expected.searchBy);
    component.filterForm.get(keys.orderBy)?.setValue(expected.orderBy);
    component.filterForm.get(keys.orderDirection)?.setValue(expected.orderDirection);

    component.filterForm.get(keys.statusGroupName)?.get(keys.statusGroup.ordered)?.setValue(false);
    component.filterForm.get(keys.statusGroupName)?.get(keys.statusGroup.sent)?.setValue(false);
    component.filterForm.get(keys.statusGroupName)?.get(keys.statusGroup.delivered)?.setValue(true);

    // Then
    expect(component.sortFilterConfigEmitter.emit).toHaveBeenCalledTimes(7);
    expect(emitSpy.calls.mostRecent().args[0]).toEqual(expected);
  });

  it('should fetch persisted filters from storage', () => {
    // Given
    spyOn(component.sortFilterConfigEmitter, 'emit');

    const persistedConfig: ParcelsSortFilterConfig = {
      orderBy: ParcelOrderOptionsEnum.LAST_UPDATED,
      orderDirection: ParcelOrderDirectionEnum.DESCENDING,
      searchBy: ParcelSearchOptionsEnum.TITLE,
      searchQuery: 'Packets',
      statusFilters: [ParcelStatusEnum.ORDERED, ParcelStatusEnum.DELIVERED, ParcelStatusEnum.SENT]
    };

    parcelFilterFormCacheServiceSpy.getCachedParcelFilters.and.returnValue(persistedConfig);

    // When
    component.initParcelFiltersFromCache();

    // Then
    expect(component.sortFilterConfigEmitter.emit).toHaveBeenCalledWith(persistedConfig);
  });

  it('should toggle bottom to opposite', () => {
    // Given
    component.showBottomSection = true;

    // When
    component.toggleBottomSection();

    // Then
    expect(component.showBottomSection).toEqual(false);
  });

});
