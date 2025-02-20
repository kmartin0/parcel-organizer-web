import {ParcelStatusEnum} from '../shared/models/parcel-status-enum';
import {environment} from '../../environments/environment';

// Base URL
export const BASE_API_URL = environment.parcelOrganizerApiUrl;

// User Endpoints
export const BASE_USER_URL = `${BASE_API_URL}/users`;
export const SAVE_USER = `${BASE_USER_URL}`;
export const GET_USER = `${BASE_USER_URL}`;
export const UPDATE_USER = `${BASE_USER_URL}`;
export const DELETE_USER = `${BASE_USER_URL}`;
export const CHANGE_PASSWORD = `${BASE_USER_URL}/change-password`;
export const FORGOT_PASSWORD = `${BASE_USER_URL}/forgot-password`;
export const RESET_PASSWORD = `${BASE_USER_URL}/reset-password`;

// Auth Endpoints
export const OAUTH = `${BASE_API_URL}/oauth/token`;

// Parcel Endpoints
export const BASE_PARCEL_URL = `${BASE_API_URL}/parcels`;
export const SAVE_PARCEL = `${BASE_PARCEL_URL}`;
export const GET_PARCELS = `${BASE_PARCEL_URL}`;
export const GET_PARCEL = (parcelId: number) => `${BASE_PARCEL_URL}/${parcelId}`;
export const UPDATE_PARCEL = `${BASE_PARCEL_URL}/`;
export const DELETE_PARCEL = (parcelId: number) => `${BASE_PARCEL_URL}/${parcelId}`;

// Parcel Status Endpoints
export const BASE_PARCEL_STATUS = `${BASE_API_URL}/parcel-statuses`;
export const GET_PARCEL_STATUSES = BASE_PARCEL_STATUS;
export const GET_PARCEL_STATUS_BY_ID = (parcelStatusId: number) => `${BASE_PARCEL_STATUS}/id/${parcelStatusId}`;
export const GET_PARCEL_STATUS_BY_STATUS = (parcelStatus: ParcelStatusEnum) => `${BASE_PARCEL_STATUS}/status/${parcelStatus}`;

// Http Methods
export const POST = 'POST';
export const GET = 'GET';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
