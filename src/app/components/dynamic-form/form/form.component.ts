import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {TextBoxInputField} from '../input/text-box-input-field';
import {ErrorMessageService} from '../../../services/error-message.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {SuccessComponent} from '../../success/success.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {

  @Input() loading$?: Subject<boolean>;
  @Input() formName: string = 'Submit';
  @Input() inputFields: TextBoxInputField[];
  @Input() formValidators: ValidatorFn[];
  @Output() successComplete = new EventEmitter<any>();
  @Output() formValidSubmit: EventEmitter<{ [key: string]: string; }> = new EventEmitter();

  private formGroup: FormGroup;
  private errorMessages: { [key: string]: string[]; } = {};
  private unsubscribe$: Subject<void> = new Subject<void>();

  @ViewChild(SuccessComponent, {static: false}) private successComponent: SuccessComponent;

  constructor(private errorMessageService: ErrorMessageService) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  onSubmit() {
    this.markFormAsDirty();
    this.formGroup.valid ? this.onFormValid() : this.onFormInvalid();
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

  resetForm() {
    this.formGroup.reset();
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
    this.formGroup = new FormGroup(tmpFormGroup, {validators: this.formValidators});

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
  }

  getFormControl(key: string): FormControl {
    return <FormControl> this.formGroup.get(key);
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  displaySuccess(value?: any) {
    this.successComponent.play(value);
  }
}

// https://stackblitz.com/edit/angular-dynamic-form-builder
