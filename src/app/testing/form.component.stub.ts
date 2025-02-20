import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormComponent} from '../shared/components/dynamic-form/form/form.component';
import {UntypedFormControl, ValidatorFn} from '@angular/forms';
import {Subject} from 'rxjs';
import {BaseInputField} from '../shared/components/dynamic-form/base-input-field';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
    selector: 'app-form',
    template: '',
    providers: [{ provide: FormComponent, useClass: FormComponentStub }],
    standalone: true
})
export class FormComponentStub {

  @Input() confirmButtonWidth = '50%';
  @Input() loading$?: Subject<boolean>;
  @Input() formName = 'Submit';
  @Input() inputFields!: BaseInputField[];
  @Input() formValidators!: ValidatorFn[];
  @Output() formValidSubmit: EventEmitter<{ [key: string]: string; }> = new EventEmitter();

  getFormControl(key: string): UntypedFormControl {
    return new UntypedFormControl();
  }

  resetForm(value?: any) {
  }

  setError(formControlKey: string, error: string) {
  };

}
