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

  getCachedParcelFilters(): ParcelsSortFilterConfig {
    return JSON.parse(localStorage.getItem(STORAGE_PARCEL_FILTERS_KEY));
  }

}

export const STORAGE_PARCEL_FILTERS_KEY = 'parcel-filters';
