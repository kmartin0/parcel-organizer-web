import {Injectable} from '@angular/core';
import {ParcelsSortFilterConfig} from '../../components/parcel-filter-form/parcels-sort-filter-config';

@Injectable({
  providedIn: 'root'
})
export class ParcelFilterFormCacheService {

  private STORAGE_PARCEL_FILTERS_KEY = 'parcel-filters';

  constructor() {

  }

  persistParcelFilters(parcelFilters: ParcelsSortFilterConfig) {
    localStorage.setItem(this.STORAGE_PARCEL_FILTERS_KEY, JSON.stringify(parcelFilters));
  }

  getCachedParcelFilters(): ParcelsSortFilterConfig {
    return JSON.parse(localStorage.getItem(this.STORAGE_PARCEL_FILTERS_KEY));
  }

}
