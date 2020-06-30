import {ErrorMessageService} from './error-message.service';
import {ValidationErrors} from '@angular/forms';

describe('ErrorMessageService', () => {

  let service: ErrorMessageService;

  beforeEach(() => {
    service = new ErrorMessageService();
  });

  it('should return null when no validationError provided', () => {
    expect(service.getErrorMessagesForValidationErrors(null)).toBeNull();
  });

  it('should return custom error message', () => {
    const error: ValidationErrors = {
      'customError': 'My very own message'
    };

    expect(service.getErrorMessagesForValidationErrors(error)).toEqual(['My very own message']);
  });

  it('should return defaultErrors', () => {
    const error: ValidationErrors = {
      'required': null,
      'minlength': {requiredLength: 5, actualLength: 4},
      'maxlength': {requiredLength: 5, actualLength: 6},
      'email': null,
      'confirmPassword': null,
    };

    expect(service.getErrorMessagesForValidationErrors(error)).toEqual(jasmine.arrayWithExactContents([
      'This field is required',
      'This field requires a minimum of 5 characters',
      'This field requires a maximum of 5 characters',
      'This field requires a valid email',
      'Passwords must match'
    ]));
  });

  it('should return undefined error message when a key is not found', () => {
    const error: ValidationErrors = {
      undefinedErrorMsg: ''
    };

    expect(service.getErrorMessagesForValidationErrors(error)).toEqual(['Undefined Error Message']);
  });

});
