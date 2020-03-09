import {Injectable} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {DELETE_PARCEL, GET_PARCELS} from '../../api/api-endpoints';
import {Observable} from 'rxjs';
import {Parcel} from '../models/parcel';

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
    return this.baseApiService.makeDelete(DELETE_PARCEL(10000));
  }
}
