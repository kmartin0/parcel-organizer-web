import {ParcelStatusEnum} from '../shared/models/parcel-status-enum';

// Base URL
export const BASE_API_URL = 'https://parcel-organizer-api.herokuapp.com/';
// export const BASE_API_URL = 'http://localhost:8080/';

// User Endpoints
export const BASE_USER_URL = BASE_API_URL + 'users';
export const SAVE_USER = BASE_USER_URL;
export const GET_USER = BASE_USER_URL;
export const UPDATE_USER = BASE_USER_URL;
export const DELETE_USER = BASE_USER_URL;
export const CHANGE_PASSWORD = BASE_USER_URL + '/change-password';

// Auth Endpoints
export const LOGIN = BASE_API_URL + 'oauth/token';

// Parcel Endpoints
export const BASE_PARCEL_URL = BASE_API_URL + 'parcels';
export const SAVE_PARCEL = BASE_PARCEL_URL;
export const GET_PARCELS = BASE_PARCEL_URL;
export const GET_PARCEL = (parcelId) => BASE_PARCEL_URL + `/${parcelId}`;
export const UPDATE_PARCEL = BASE_PARCEL_URL;
export const DELETE_PARCEL = (parcelId) => BASE_PARCEL_URL + `/${parcelId}`;

// Parcel Status Endpoints
export const BASE_PARCEL_STATUS = BASE_API_URL + 'parcel-statuses';
export const GET_PARCEL_STATUSES = BASE_PARCEL_STATUS;
export const GET_PARCEL_STATUS_BY_ID = (parcelStatusId) => BASE_PARCEL_STATUS + `/id/${parcelStatusId}`;
export const GET_PARCEL_STATUS_BY_STATUS = (parcelStatus:ParcelStatusEnum) => BASE_PARCEL_STATUS + `/status/${parcelStatus}`;

// Http Methods
export const POST = 'POST';
export const GET = 'GET';
export const PUT = 'PUT';
export const DELETE = 'DELETE';

export function shouldBasicAuth(url: string, method: string): boolean {
  switch (method) {
    // // Not supported by api yet.
    // case GET: {
    //   return url.startsWith(SAVE_USER) || url.startsWith(BASE_PARCEL_STATUS);
    // }
    case POST: {
      return url.startsWith(LOGIN);
    }
    default:
      return false;
  }
}

export function shouldBearerTokenAuth(url: string, method: string): boolean {
  switch (method) {
    case GET: {
      return url.startsWith(BASE_USER_URL) || url.startsWith(BASE_PARCEL_URL);
    }
    case POST: {
      return url.startsWith(CHANGE_PASSWORD) || url.startsWith(BASE_PARCEL_URL);
    }
    case PUT: {
      return url.startsWith(BASE_USER_URL) || url.startsWith(BASE_PARCEL_URL);
    }
    case DELETE: {
      return url.startsWith(BASE_USER_URL) || url.startsWith(BASE_PARCEL_URL);
    }
    default:
      return false;
  }
}
