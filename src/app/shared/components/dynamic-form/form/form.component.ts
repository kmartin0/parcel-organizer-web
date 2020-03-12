import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {ErrorMessageService} from '../../../services/error-message.service';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {SuccessComponent} from '../../success/success.component';
import {BaseInputField} from '../base-input-field';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {

  @Input() confirmButtonWidth = '50%';
  @Input() loading$?: Subject<boolean>;
  @Input() formName: string = 'Submit';
  @Input() inputFields: BaseInputField<string>[];
  @Input() formValidators: ValidatorFn[];
  @Output() formValidSubmit: EventEmitter<{ [key: string]: string; }> = new EventEmitter();

  private _formGroup: FormGroup;
  private errorMessages: { [key: string]: string[]; } = {};
  private unsubscribe$: Subject<void> = new Subject<void>();
  private _valueChanges$: Observable<{ key: string, value: string }>;

  @ViewChild(SuccessComponent, {static: false}) private successComponent: SuccessComponent;

  constructor(private errorMessageService: ErrorMessageService) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  onSubmit() {
    this.markFormAsDirty();
    this._formGroup.valid ? this.onFormValid() : this.onFormInvalid();
  }

  onFormValid() {
    this.formValidSubmit.emit(this.formGroup.value);
  }

  onFormInvalid() {
    // Display the general form errors.
    this.errorMessages['formGroup'] = this.errorMessageService.getErrorMessagesForValidationErrors(this.formGroup.errors);

    // Display the input field errors.
    Object.keys(this.formGroup.controls).forEach(key => {
      const formControl = this.formGroup.controls[key];
      this.errorMessages[key] = this.errorMessageService.getErrorMessagesForValidationErrors(formControl.errors);
    });
  }

  markFormAsDirty() {
    this.formGroup.markAsDirty();

    Object.keys(this.formGroup.controls).forEach(key => {
      const formControl = this.formGroup.controls[key];
      formControl.markAsDirty();
    });
  }

  resetForm(value?: any) {
    this.formGroup.reset(value);
  }

  setError(formControlKey: string, error: string) {
    if (error) {
      let target = this.formGroup.controls[formControlKey] || this.formGroup;
      let tmpErrors = target.errors;
      let errorValue;
      errorValue = tmpErrors != null && tmpErrors['customError'] != null ? {'customError': [...tmpErrors['customError'], error]} : {'customError': [error]};
      target.setErrors(errorValue);
    }
  }

  /**
   * Initializes [formGroup] and adds a [FormControl] for each [BaseInputField].
   * Updates [errorMessages] for each [FormControl] whenever the status changes.
   */
  private initFormGroup() {
    // Create a [FormControl] for each inputField and add it to [tmpFormGroup].
    let tmpFormGroup = {};
    this.inputFields.forEach(inputField => {
      tmpFormGroup[inputField.key] = new FormControl(inputField.value || '', inputField.validators);
    });

    // Initialize [formGroup]
    this._formGroup = new FormGroup(tmpFormGroup, {validators: this.formValidators});

    // Observe the status for each FormControl. Whenever the status changes update the error message.
    Object.keys(this.formGroup.controls).forEach(key => {
      const formControl = this.formGroup.controls[key];
      formControl.statusChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(status => {
        this.errorMessages[key] = this.errorMessageService.getErrorMessagesForValidationErrors(formControl.errors);
      });
    });
    // Observe the status for the formGroup. Whenever the status changes update the error message.
    this.formGroup.statusChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.errorMessages['formGroup'] = this.errorMessageService.getErrorMessagesForValidationErrors(this.formGroup.errors);
    });

    this.initValueChanges$();
  }

  getFormControl(key: string): FormControl {
    return <FormControl> this.formGroup.get(key);
  }

  initValueChanges$() {
    this._valueChanges$ = new Observable(subscriber => {
      // Observe the status for each FormControl. Whenever the status changes update the error message.
      Object.keys(this.formGroup.controls).forEach(key => {
        const formControl = this.formGroup.controls[key];
        formControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
          subscriber.next({key: key, value: value});
        });
      });
    });
  }

  get valueChanges$(): Observable<{ key: string, value: string }> {
    return this._valueChanges$;
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  displaySuccess(callback: () => void) {
    this.successComponent.play(callback);
  }
}

// https://stackblitz.com/edit/angular-dynamic-form-builder
