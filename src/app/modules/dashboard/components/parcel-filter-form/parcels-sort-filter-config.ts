import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';

export interface ParcelsSortFilterConfig {
  // Sort Options
  orderBy: ParcelOrderOptionsEnum,
  orderDirection: ParcelOrderDirectionEnum,

  // Filter Options
  searchQuery: string,
  searchBy: ParcelSearchOptionsEnum,
  statusFilters: ParcelStatusEnum[]
}

export enum ParcelSearchOptionsEnum {
  TITLE = 'TITLE',
  SENDER = 'SENDER',
  COURIER = 'COURIER'
}

export enum ParcelOrderOptionsEnum {
  TITLE = 'TITLE',
  SENDER = 'SENDER',
  COURIER = 'COURIER',
  LAST_UPDATED = 'LAST_UPDATED',
  STATUS = 'STATUS'
}

export enum ParcelOrderDirectionEnum {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING'
}
