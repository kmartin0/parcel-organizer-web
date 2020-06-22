import {
  ParcelOrderDirectionEnum,
  ParcelOrderOptionsEnum,
  ParcelSearchOptionsEnum,
  ParcelsSortFilterConfig
} from '../../components/parcel-filter-form/parcels-sort-filter-config';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {ParcelFilterFormCacheService, STORAGE_PARCEL_FILTERS_KEY} from './parcel-filter-form-cache.service';

describe('ParcelFilterFormCacheService', () => {

  let parcelFilterFormCacheService: ParcelFilterFormCacheService;
  let parcelConfig: ParcelsSortFilterConfig;

  beforeEach(() => {
    parcelFilterFormCacheService = new ParcelFilterFormCacheService();

    parcelConfig = {
      orderBy: ParcelOrderOptionsEnum.SENDER,
      orderDirection: ParcelOrderDirectionEnum.DESCENDING,
      searchBy: ParcelSearchOptionsEnum.TITLE,
      searchQuery: '',
      statusFilters: [ParcelStatusEnum.SENT]
    };
  });

  it('should persist parcel config in local storage', () => {
    // Given
    spyOn(localStorage, 'setItem');

    const expectedParcelConfigArgument = JSON.stringify(parcelConfig);

    // When
    parcelFilterFormCacheService.persistParcelFilters(parcelConfig);

    // Then
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_PARCEL_FILTERS_KEY, expectedParcelConfigArgument);
  });

  it('should retrieve parcel config in local storage', () => {
    // Given
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(parcelConfig));

    // When
    const result = parcelFilterFormCacheService.getCachedParcelFilters();

    // Then
    expect(result).toEqual(parcelConfig);
  });

});
