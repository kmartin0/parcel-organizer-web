import {ParcelStatus} from './parcel-status';

export interface Parcel {
  id?: number,
  title?: string,
  sender?: string,
  courier?: string,
  trackingUrl?: string,
  additionalInformation?: string,
  parcelStatus?: ParcelStatus,
  lastUpdated?: Date,
}
