import {ApiErrorEnum} from '../../api/api-error.enum';

export interface ApiErrorBody {
  error: ApiErrorEnum,
  description?: string,
  error_description?: string,
  code: number,
  details?: { target: string, error: string }[]
}

export function isApiErrorBody(object): object is ApiErrorBody {
  const apiErrorBody = object as ApiErrorBody;
  return apiErrorBody.error !== undefined && (apiErrorBody.description || apiErrorBody.error_description) !== undefined;
}
