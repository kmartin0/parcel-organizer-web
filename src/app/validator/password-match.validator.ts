import {AbstractControl, ValidatorFn} from '@angular/forms';

export function passwordMatchValidator(controlName: string, matchingControlName: string, errorName: string): ValidatorFn {
  return (abstractControl: AbstractControl) => {
    const control = abstractControl.get(controlName);
    const matchingControl = abstractControl.get(matchingControlName);

    if ((control || matchingControl) == null) {
      return null;
    }

    let tmpConfirmErrors = matchingControl.errors;

    if (control.value !== matchingControl.value) {
      if (tmpConfirmErrors !== null) {
        tmpConfirmErrors.confirmPassword = false;
        matchingControl.setErrors(tmpConfirmErrors);
      } else {
        matchingControl.setErrors({[errorName]: false});
      }
    } else if (tmpConfirmErrors != null && tmpConfirmErrors.hasOwnProperty(errorName)) {
      delete tmpConfirmErrors.confirmPassword;
      matchingControl.setErrors(tmpConfirmErrors);
    }
    return null;
  };
}
