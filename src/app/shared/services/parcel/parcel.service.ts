import {Injectable} from '@angular/core';
import {ApiService} from '../api/api.service';
import {DELETE_PARCEL, GET_PARCEL, GET_PARCEL_STATUS_BY_STATUS, GET_PARCELS, SAVE_PARCEL, UPDATE_PARCEL} from '../../../api/api-endpoints';
import {Observable} from 'rxjs';
import {Parcel} from '../../models/parcel';
import {ParcelStatus} from '../../models/parcel-status';
import {ParcelStatusEnum} from '../../models/parcel-status-enum';

@Injectable({
  providedIn: 'root'
})
export class ParcelService {

  constructor(private baseApiService: ApiService) {
  }

  createParcel(parcel: Parcel): Observable<Parcel> {
    return this.baseApiService.makePost<Parcel>(SAVE_PARCEL, parcel);
  }

  getParcel(parcelId): Observable<Parcel> {
    return this.baseApiService.makeGet(GET_PARCEL(parcelId));
  }

  getParcels(): Observable<Parcel[]> {
    return this.baseApiService.makeGet(GET_PARCELS);
  }

  editParcel(parcel: Parcel): Observable<Parcel> {
    return this.baseApiService.makePut(UPDATE_PARCEL, parcel);
  }

  deleteParcel(parcelId: number): Observable<any> {
    return this.baseApiService.makeDelete(DELETE_PARCEL(parcelId));
  }

  getParcelStatus(parcelStatusEnum: ParcelStatusEnum): Observable<ParcelStatus> {
    return this.baseApiService.makeGet(GET_PARCEL_STATUS_BY_STATUS(parcelStatusEnum));
  }

}
