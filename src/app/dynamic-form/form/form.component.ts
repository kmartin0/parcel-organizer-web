import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {TextBoxInputField} from '../input/text-box-input-field';
import {ErrorMessageService} from '../../service/error-message.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {User} from '../../model/user';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {

  @Input() formName: string = 'Submit';
  @Input() inputFields: TextBoxInputField[];
  @Input() formValidators: ValidatorFn[];
  @Output() formValidSubmit: EventEmitter<{ [key: string]: string; }> = new EventEmitter();

  private formGroup: FormGroup;

  private errorMessages: { [key: string]: string[]; } = {};

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private errorMessageService: ErrorMessageService) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  onSubmit() {
    this.formGroup.valid ? this.onFormValid() : this.onFormInvalid();
  }

  onFormValid() {
    this.formValidSubmit.emit(this.formGroup.value);
  }

  onFormInvalid() {
    Object.keys(this.formGroup.controls).forEach(key => {
      const formControl = this.formGroup.controls[key];
      formControl.markAsDirty();
      this.errorMessages[key] = this.errorMessageService.getErrorMessagesForValidationErrors(formControl.errors);
    });
  }

  resetForm() {
    this.formGroup.reset();
  }

  setError(key: string, error: string) {
    let formControl = this.formGroup.controls[key];
    let tmpErrors = formControl.errors;
    let errorValue = {['value']: error};

    if (tmpErrors !== null) {
      tmpErrors.error = errorValue;
      formControl.setErrors(tmpErrors);
    } else {
      formControl.setErrors({['error']: errorValue});
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
  }

  getFormControl(key: string): FormControl {
    return <FormControl> this.formGroup.get(key);
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

// https://stackblitz.com/edit/angular-dynamic-form-builder
