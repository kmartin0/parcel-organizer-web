import {AbstractControl, ValidatorFn} from '@angular/forms';

export function passwordMatchValidator(controlName: string, matchingControlName: string, errorName: string): ValidatorFn {
  return (abstractControl: AbstractControl) => {
    const control = abstractControl.get(controlName);
    const matchingControl = abstractControl.get(matchingControlName);

    if (!control || !matchingControl) {
      console.warn('control or matchingControl is null');
      return null;
    }

    let tmpConfirmErrors = matchingControl.errors;

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({...tmpConfirmErrors, [errorName]: false});
    } else if (tmpConfirmErrors != null && tmpConfirmErrors.hasOwnProperty(errorName)) {
      delete tmpConfirmErrors[errorName];
      Object.keys(tmpConfirmErrors).length > 0 ? matchingControl.setErrors(tmpConfirmErrors) : matchingControl.setErrors(null);
    }
    return null;
  };
}
