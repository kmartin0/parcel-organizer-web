import {ApiErrorEnum} from '../../api/api-error.enum';

export interface ApiErrorBody {
  error: ApiErrorEnum,
  description?: string,
  error_description?: string,
  code: number,
  details?: { [target: string]: string } // array of details for targets containing the target and the error.
}

export function isApiErrorBody(object: any): object is ApiErrorBody {
  const apiErrorBody = object as ApiErrorBody;
  return apiErrorBody.error !== undefined && (apiErrorBody.description || apiErrorBody.error_description) !== undefined;
}
