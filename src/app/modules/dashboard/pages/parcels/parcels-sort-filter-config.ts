import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';

export interface ParcelsSortFilterConfig {
  // Sort Options
  orderBy: ParcelOrderOptionsEnum,
  orderDirection: ParcelOrderDirectionEnum,

  // Filter Options
  searchQuery: string,
  searchBy: ParcelSearchOptionsEnum,

  statusFilters: ParcelStatusEnum[]
  // ordered: boolean,
  // sent: boolean,
  // delivered: boolean,

  // // Sort Options
  // orderBy: ParcelOrderOptionsEnum;
  // orderDirection: ParcelOrderDirectionEnum;
  //
  // // Filter Options
  // searchQuery: string;
  // searchBy: ParcelSearchOptionsEnum;
  //
  // ordered: boolean = true;
  // sent: boolean = false;
  // delivered: boolean = false;


  // constructor(orderBy?: ParcelOrderOptionsEnum, orderDirection?: ParcelOrderDirectionEnum, searchQuery?: string, searchBy?: ParcelSearchOptionsEnum, ordered?: boolean, sent?: boolean, delivered?: boolean) {
  //   this.orderBy = orderBy;
  //   this.orderDirection = orderDirection;
  //   this.searchQuery = searchQuery;
  //   this.searchBy = searchBy;
  //   this.ordered = ordered;
  //   this.sent = sent;
  //   this.delivered = delivered;
  // }


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
