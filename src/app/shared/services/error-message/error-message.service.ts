import {Injectable} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  constructor() {
  }

  public getErrorMessagesForValidationErrors(validationErrors: ValidationErrors | null): string[] | null {

    if (validationErrors === null) {
      return null;
    }

    // Define array to store the error messages.
    let errors = new Array<string>();

    // Iterate through validationErrors, construct user readable messages and store in errors array.
    Object.keys(validationErrors).forEach(key => {
      const error = this.defaultErrors[key];
      if (key == 'customError') {
        errors.push(validationErrors[key]);
        return;
      }
      if (error != null) {
        errors.push(error instanceof Function ? error(validationErrors[key]) : error);
      } else {
        errors.push('Undefined Error Message');
      }
    });

    // Return array of user readable errors.
    return errors;
  }

  private readonly defaultErrors: {
    [key: string]: string | Function
  } = {
    required: `This field is required`,
    minlength: ({requiredLength, actualLength}: {
      requiredLength: number,
      actualLength: number
    }) => `This field requires a minimum of ${requiredLength} characters`,
    maxlength: ({requiredLength, actualLength}: {
      requiredLength: number,
      actualLength: number
    }) => `This field requires a maximum of ${requiredLength} characters`,
    email: `This field requires a valid email`,
    confirmPassword: `Passwords must match`,
  };

}
