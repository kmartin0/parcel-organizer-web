import {ApiErrorEnum} from '../api-error.enum';

export interface ApiErrorBody {
  error: ApiErrorEnum,
  description: string,
  code: number,
  details?: { target: string, error: string }[]
}

export function isApiErrorBody(object): object is ApiErrorBody {
  const apiErrorBody = object as ApiErrorBody;
  return apiErrorBody.error && apiErrorBody.description !== undefined;
}
