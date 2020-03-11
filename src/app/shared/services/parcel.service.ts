import {Injectable} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {DELETE_PARCEL, GET_PARCEL, GET_PARCEL_STATUS_BY_STATUS, GET_PARCELS, UPDATE_PARCEL} from '../../api/api-endpoints';
import {Observable} from 'rxjs';
import {Parcel} from '../models/parcel';
import {ParcelStatus} from '../models/parcel-status';
import {ParcelStatusEnum} from '../models/parcel-status-enum';

@Injectable({
  providedIn: 'root'
})
export class ParcelService {

  constructor(private baseApiService: BaseApiService) {
  }

  getParcels(): Observable<Parcel[]> {
    return this.baseApiService.makeGet(GET_PARCELS);
  }

  deleteParcel(parcelId: number): Observable<any> {
    return this.baseApiService.makeDelete(DELETE_PARCEL(parcelId));
  }

  getParcel(parcelId): Observable<Parcel> {
    return this.baseApiService.makeGet(GET_PARCEL(parcelId));
  }

  editParcel(parcel: Parcel): Observable<Parcel> {
    return this.baseApiService.makePut(UPDATE_PARCEL, parcel);
  }

  getParcelStatus(parcelStatusEnum: ParcelStatusEnum): Observable<ParcelStatus> {
    return this.baseApiService.makeGet(GET_PARCEL_STATUS_BY_STATUS(parcelStatusEnum));
  }
}
