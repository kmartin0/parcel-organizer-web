import {Injectable} from '@angular/core';
import {ParcelsSortFilterConfig} from '../../components/parcel-filter-form/parcels-sort-filter-config';

@Injectable({
  providedIn: 'root'
})
export class ParcelFilterFormCacheService {

  constructor() {

  }

  persistParcelFilters(parcelFilters: ParcelsSortFilterConfig) {
    localStorage.setItem(STORAGE_PARCEL_FILTERS_KEY, JSON.stringify(parcelFilters));
  }

  getCachedParcelFilters(): ParcelsSortFilterConfig | undefined {
    const cachedFilters = localStorage.getItem(STORAGE_PARCEL_FILTERS_KEY);

    // If cachedFilters is null, return null; otherwise, parse the value
    return cachedFilters ? JSON.parse(cachedFilters) : undefined;
  }

}

export const STORAGE_PARCEL_FILTERS_KEY = 'parcel-filters';
