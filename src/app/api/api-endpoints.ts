// Base URL
export const BASE_API_URL = 'https://parcel-organizer-api.herokuapp.com/';
// export const BASE_API_URL = 'http://localhost:8080/';

// User Endpoints
export const SAVE_USER = BASE_API_URL + 'users';
export const GET_USER = BASE_API_URL + 'users';
export const UPDATE_USER = BASE_API_URL + 'users';
export const DELETE_USER = BASE_API_URL + 'users';
export const CHANGE_PASSWORD = BASE_API_URL + 'users/change-password';
export const LOGIN = BASE_API_URL + 'oauth/token';

// Parcel Endpoints
export const SAVE_PARCEL = BASE_API_URL + 'parcels';
export const GET_PARCELS = BASE_API_URL + 'parcels';
export const GET_PARCEL = BASE_API_URL + 'parcels/{parcelId}';
export const UPDATE_PARCEL = BASE_API_URL + 'parcels';
export const DELETE_PARCEL = BASE_API_URL + 'parcels/{parcelId}';

// Parcel Status Endpoints
export const GET_PARCEL_STATUSES = BASE_API_URL + 'parcel-statuses';
export const GET_PARCEL_STATUS_BY_ID = BASE_API_URL + 'parcel-statuses/id/{parcelStatusId}';
export const GET_PARCEL_STATUS_BY_STATUS = BASE_API_URL + 'parcel-statuses/status/{parcelStatus}';

// Http Methods
export const POST = 'POST';
export const GET = 'GET';
export const PUT = 'PUT';
export const DELETE = 'DELETE';

export function shouldBasicAuth(url: string, method: string): boolean {
  switch (method) {
    // GET commented because server doesn't support this yet.
    // case GET: {
    //   switch (url) {
    //     case SAVE_USER:
    //     case GET_PARCEL_STATUSES:
    //     case GET_PARCEL_STATUS_BY_ID:
    //     case GET_PARCEL_STATUS_BY_STATUS: {
    //       return true;
    //     }
    //     default:
    //       return false;
    //   }
    // }
    case POST: {
      switch (url) {
        case LOGIN : {
          return true;
        }
        default:
          return false;
      }
    }
    default:
      return false;
  }
}

export function shouldBearerTokenAuth(url: string, method: string): boolean {
  switch (method) {
    case GET: {
      switch (url) {
        case GET_USER:
        case GET_PARCELS:
        case GET_PARCEL: {
          return true;
        }
        default:
          return false;
      }
    }
    case POST: {
      switch (url) {
        case CHANGE_PASSWORD:
        case SAVE_PARCEL: {
          return true;
        }
        default:
          return false;
      }
    }
    case PUT: {
      switch (url) {
        case UPDATE_USER:
        case UPDATE_PARCEL: {
          return true;
        }
        default:
          return false;
      }
    }
    case DELETE: {
      switch (url) {
        case DELETE_USER:
        case DELETE_PARCEL: {
          return true;
        }
        default:
          return false;
      }
    }
    default:
      return false;
  }
}
