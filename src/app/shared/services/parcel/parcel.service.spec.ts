import {ParcelService} from './parcel.service';
import {ApiService} from '../api/api.service';
import {DELETE_PARCEL, GET_PARCEL, GET_PARCEL_STATUS_BY_STATUS, GET_PARCELS, SAVE_PARCEL, UPDATE_PARCEL} from '../../../api/api-endpoints';
import {Parcel} from '../../models/parcel';
import {ParcelStatusEnum} from '../../models/parcel-status-enum';
import {of} from 'rxjs';
import {ParcelStatus} from '../../models/parcel-status';

describe('ParcelService', () => {

  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let parcelService: ParcelService;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['makeGet', 'makePost', 'makeDelete', 'makePut']);
    parcelService = new ParcelService(apiServiceSpy);
  });

  it('should create parcel using api', (done) => {
    // Given
    const parcel: Parcel = {
      additionalInformation: '',
      courier: 'DHL',
      id: 0,
      lastUpdated: null,
      parcelStatus: {status: ParcelStatusEnum.SENT, id: 1},
      sender: 'Zalando',
      title: 'Shoes',
      trackingUrl: null
    };

    const result: Parcel = {
      additionalInformation: '',
      courier: 'DHL',
      id: 10,
      lastUpdated: new Date(),
      parcelStatus: {status: ParcelStatusEnum.SENT, id: 1},
      sender: 'Zalando',
      title: 'Shoes',
      trackingUrl: null
    };

    apiServiceSpy.makePost.withArgs(SAVE_PARCEL, parcel).and.returnValue(of(result));

    // When
    parcelService.createParcel(parcel).subscribe(value => {
      expect(value).toEqual(result);
      done();
    }, fail);
  });

  it('should return parcel from api', (done) => {
    // Given
    const parcel: Parcel = {
      additionalInformation: '',
      courier: 'UPS',
      id: 10,
      lastUpdated: new Date(),
      parcelStatus: {status: ParcelStatusEnum.DELIVERED, id: 0},
      sender: 'Amazon',
      title: 'Clothing',
      trackingUrl: 'amazon/tracking/1'
    };

    apiServiceSpy.makeGet.withArgs(GET_PARCEL(10)).and.returnValue(of(parcel));

    // When
    parcelService.getParcel(10).subscribe(value => {
      // Then
      expect(value).toEqual(parcel);
      done();
    }, fail);
  });

  it('should return parcels array from api', (done) => {
    // Given
    const parcels = new Array<Parcel>(
      {
        additionalInformation: '',
        courier: 'DHL',
        id: 0,
        lastUpdated: new Date(),
        parcelStatus: {status: ParcelStatusEnum.SENT, id: 1},
        sender: 'Zalando',
        title: 'Shoes',
        trackingUrl: null
      },
      {
        additionalInformation: '',
        courier: 'UPS',
        id: 1,
        lastUpdated: new Date(),
        parcelStatus: {status: ParcelStatusEnum.DELIVERED, id: 0},
        sender: 'Amazon',
        title: 'Clothing',
        trackingUrl: 'amazon/tracking/1'
      });

    apiServiceSpy.makeGet.withArgs(GET_PARCELS).and.returnValue(of(parcels));

    // When
    parcelService.getParcels().subscribe(value => {
      // Then
      expect(value).toEqual(jasmine.arrayWithExactContents(parcels));
      done();
    }, fail);
  });

  it('should update parcel using api', (done) => {
    // Given
    const parcel: Parcel = {
      additionalInformation: '',
      courier: 'DHL',
      id: 10,
      lastUpdated: null,
      parcelStatus: {status: ParcelStatusEnum.SENT, id: 1},
      sender: 'Zalando',
      title: 'Shoes',
      trackingUrl: null
    };

    const result: Parcel = {
      additionalInformation: '',
      courier: 'DHL',
      id: 10,
      lastUpdated: new Date(),
      parcelStatus: {status: ParcelStatusEnum.SENT, id: 1},
      sender: 'Zalando',
      title: 'Shoes',
      trackingUrl: null
    };

    apiServiceSpy.makePut.withArgs(UPDATE_PARCEL, parcel).and.returnValue(of(result));

    // When
    parcelService.editParcel(parcel).subscribe(value => {
      expect(value).toEqual(result);
      done();
    }, fail);
  });

  it('should delete parcel using api', (done) => {
    // Given
    apiServiceSpy.makeDelete.withArgs(DELETE_PARCEL(10)).and.returnValue(of({}));

    // When
    parcelService.deleteParcel(10).subscribe(value => {
      expect(value).toEqual({});
      done();
    }, fail);
  });

  it('should get parcel status using api', (done) => {
    // Given
    const result : ParcelStatus = {
      id: 2,
      status: ParcelStatusEnum.SENT

    }
    apiServiceSpy.makeGet.withArgs(GET_PARCEL_STATUS_BY_STATUS(ParcelStatusEnum.SENT)).and.returnValue(of(result));

    // When
    parcelService.getParcelStatus(ParcelStatusEnum.SENT).subscribe(value => {
      expect(value).toEqual(result);
      done();
    }, fail);
  });

});
