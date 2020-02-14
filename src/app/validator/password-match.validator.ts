import {AbstractControl, ValidatorFn} from '@angular/forms';

/**
 *
 * @param controlName key of the first password FormControl
 * @param matchingControlName key of password confirmation FormControl
 *
 * @return confirmPassword error state if the passwords do not match.
 */
export function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (abstractControl: AbstractControl): { [key: string]: any } | null => {
    if (abstractControl.parent) {
      const control = abstractControl.parent.get(controlName);
      const matchingControl = abstractControl.parent.get(matchingControlName);
      return control.value !== matchingControl.value ? {'confirmPassword': {value: false}} : null;
    }
    return null;
  };
}


