import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {passwordMatchValidator} from './password-match.validator';

describe('PasswordMatchValidator', () => {

  it('should add passwordMatch error to matchingControlName', () => {

    const formGroup = new UntypedFormGroup({
      password: new UntypedFormControl('1234'),
      confirmPassword: new UntypedFormControl('12345')
    }, {validators: [passwordMatchValidator('password', 'confirmPassword', 'passwordMatch')]});


    expect(formGroup.valid).toEqual(false);
    expect(formGroup.controls['confirmPassword'].errors?.['passwordMatch']).toEqual(false);

  });

  it('should add passwordMatch error to matchingControlName with existing errors', () => {

    const formGroup = new UntypedFormGroup({
      password: new UntypedFormControl('1234'),
      confirmPassword: new UntypedFormControl('12345', {validators: Validators.minLength(10)})
    }, {validators: [passwordMatchValidator('password', 'confirmPassword', 'passwordMatch')]});

    const expectedErrors = {
      minlength: {requiredLength: 10, actualLength: 5},
      passwordMatch: false
    };

    expect(formGroup.valid).toEqual(false);
    expect(formGroup.controls['confirmPassword'].errors).toEqual(jasmine.objectContaining(expectedErrors));

  });

  it('should remove only passwordMatch error when multiple errors', () => {
    // Given
    const formGroup = new UntypedFormGroup({
      password: new UntypedFormControl('1234'),
      confirmPassword: new UntypedFormControl('1', {validators: Validators.minLength(10)})
    }, {validators: [passwordMatchValidator('password', 'confirmPassword', 'passwordMatch')]});

    formGroup.controls['password'].setValue('1');
    expect(formGroup.controls['confirmPassword'].errors).toEqual({minlength: {requiredLength: 10, actualLength: 1}});
  });

  it('should set confirmPassword errors to null', () => {
    // Given
    const formGroup = new UntypedFormGroup({
      password: new UntypedFormControl('1234'),
      confirmPassword: new UntypedFormControl('1')
    }, {validators: [passwordMatchValidator('password', 'confirmPassword', 'passwordMatch')]});

    formGroup.controls['password'].setValue('1');
    expect(formGroup.controls['confirmPassword'].errors).toEqual(null);
  });

  it('should ignore validator with wrong controlName', () => {
    spyOn(console, 'warn');

    const formGroup = new UntypedFormGroup({
      password: new UntypedFormControl('1234'),
      confirmPassword: new UntypedFormControl('12345')
    }, {validators: [passwordMatchValidator('pass', 'confirmPassword', 'passwordMatch')]});

    expect(formGroup.valid).toEqual(true);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('should ignore validator with wrong matchingControlName', () => {
    spyOn(console, 'warn');

    const formGroup = new UntypedFormGroup({
      password: new UntypedFormControl('1234'),
      confirmPassword: new UntypedFormControl('12345')
    }, {validators: [passwordMatchValidator('password', 'confirm', 'passwordMatch')]});

    expect(formGroup.valid).toEqual(true);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

})
;
