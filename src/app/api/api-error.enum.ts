export enum ApiErrorEnum {
  invalid_token = 'invalid_token',
  invalid_grant = 'invalid_grant',
  access_denied = 'access_denied',
  INVALID_ARGUMENTS = 'INVALID_ARGUMENTS', // 400
  MESSAGE_NOT_READABLE = 'MESSAGE_NOT_READABLE', // 400
  UNAUTHENTICATED = 'UNAUTHENTICATED', // 401
  PERMISSION_DENIED = 'PERMISSION_DENIED', // 403
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND', // 404
  URI_NOT_FOUND = 'URI_NOT_FOUND', // 404
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED', // 405
  ALREADY_EXISTS = 'ALREADY_EXISTS', // 409
  UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE', // 415
  INTERNAL = 'INTERNAL', // 500
  UNAVAILABLE = 'UNAVAILABLE' // 503
}
