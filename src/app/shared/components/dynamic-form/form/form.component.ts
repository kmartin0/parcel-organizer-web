import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ErrorMessageService} from '../../../services/error-message/error-message.service';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {SuccessComponent} from '../../success/success.component';
import {BaseInputField, InputFieldEnum} from '../base-input-field';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {TextInputComponent} from '../input/textbox/text-input.component';
import {DropdownInputComponent} from '../input/dropdown/dropdown-input.component';
import {ButtonComponent} from '../../button/button.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Used to fix Expression has changed after it was checked error.
  ,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgSwitch,
    NgSwitchCase,
    NgIf,
    TextInputComponent,
    DropdownInputComponent,
    ButtonComponent,
    SuccessComponent
  ],
  standalone: true
})
export class FormComponent implements OnInit, OnDestroy {

  @Input() confirmButtonWidth = '50%';
  @Input() loading$?: Subject<boolean>;
  @Input() formName = 'Submit';
  @Input() inputFields!: BaseInputField[];
  @Input() formValidators!: ValidatorFn[];
  @Output() formValidSubmit: EventEmitter<{ [key: string]: string; }> = new EventEmitter();
  errorMessages: { [key: string]: string[]; } = {};
  inputFieldEnums = InputFieldEnum;

  private unsubscribe$: Subject<void> = new Subject<void>();
  private _formGroup!: UntypedFormGroup;
  private _valueChanges$!: Observable<{ key: string, value: string }>;
  @ViewChild(SuccessComponent, {static: false}) private successComponent!: SuccessComponent;

  constructor(private errorMessageService: ErrorMessageService) {
  }

  get valueChanges$(): Observable<{ key: string, value: string }> {
    return this._valueChanges$;
  }

  get formGroup(): UntypedFormGroup {
    return this._formGroup;
  }

  ngOnInit() {
    this.initFormGroup();
  }

  displaySuccess(callback: () => void) {
    this.successComponent.play(callback);
  }

  onSubmit() {
    this.markFormAsDirty();
    this._formGroup.valid ? this.onFormValid() : this.onFormInvalid();
  }

  resetForm(value?: any) {
    this.formGroup.reset(value);
  }

  setError(formControlKey: string|null, error: string|null) {
    if (error) {
      const target = formControlKey && this.formGroup.controls[formControlKey] || this.formGroup;
      const tmpErrors = target.errors;
      let errorValue;
      errorValue = tmpErrors != null && tmpErrors['customError'] != null ?
        {customError: [...tmpErrors['customError'], error]} :
        {customError: [error]};
      target.setErrors(errorValue);
    }
  }

  getFormControl(key: string): UntypedFormControl {
    return this.formGroup.get(key) as UntypedFormControl;
  }

  private getErrorMessages(errors: ValidationErrors | null): string[] {
    // Default to an empty object if errors is null, and return the error messages or an empty array.
    const safeErrors = errors || {};
    return this.errorMessageService.getErrorMessagesForValidationErrors(safeErrors) ?? [];
  }


  /**
   * Initializes [formGroup] and adds a [FormControl] for each [BaseInputField].
   * Updates [errorMessages] for each [FormControl] whenever the status changes.
   */
  private initFormGroup() {
    // Create a [FormControl] for each inputField and add it to [tmpFormGroup].
    const tmpFormGroup: Record<string, UntypedFormControl> = {};
    this.inputFields.forEach(inputField => {
      tmpFormGroup[inputField.key] = new UntypedFormControl(inputField.value || '', inputField.validators);
    });

    // Initialize [formGroup]
    this._formGroup = new UntypedFormGroup(tmpFormGroup, {validators: this.formValidators});

    // Observe the status for each FormControl. Whenever the status changes update the error message.
    Object.keys(this.formGroup.controls).forEach(key => {
      const formControl = this.formGroup.controls[key];
      formControl.statusChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(_ => {
        this.errorMessages[key] = this.getErrorMessages(formControl.errors);
      });
    });
    // Observe the status for the formGroup. Whenever the status changes update the error message.
    this.formGroup.statusChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(_ => {
      this.errorMessages['formGroup'] = this.getErrorMessages(this.formGroup.errors);
    });

    this.initValueChanges$();
  }

  private initValueChanges$() {
    this._valueChanges$ = new Observable(subscriber => {
      // Observe the status for each FormControl. Whenever the status changes update the error message.
      Object.keys(this.formGroup.controls).forEach(key => {
        const formControl = this.formGroup.controls[key];
        formControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
          subscriber.next({key, value});
        });
      });
    });
  }

  private onFormValid() {
    this.formValidSubmit.emit(this.formGroup.value);
  }

  private onFormInvalid() {
    // Display the general form errors.
    this.errorMessages['formGroup'] = this.getErrorMessages(this.formGroup.errors);

    // Display the input field errors.
    Object.keys(this.formGroup.controls).forEach(key => {
      const formControl = this.formGroup.controls[key];
      this.errorMessages[key] = this.getErrorMessages(formControl.errors);
    });
  }

  private markFormAsDirty() {
    this.formGroup.markAsDirty();

    Object.keys(this.formGroup.controls).forEach(key => {
      const formControl = this.formGroup.controls[key];
      formControl.markAsDirty();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

// https://stackblitz.com/edit/angular-dynamic-form-builder
