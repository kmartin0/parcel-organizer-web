import {AbstractControl} from '@angular/forms';

export function passwordMatchValidator(controlName: string, matchingControlName: string, errorName: string) {
  return (abstractControl: AbstractControl) => {
    const control = abstractControl.get(controlName);
    const matchingControl = abstractControl.get(matchingControlName);

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
  };
}
