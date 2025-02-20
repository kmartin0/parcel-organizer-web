import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {ValidatorFn} from '@angular/forms';
import {FormComponent} from './form/form.component';

@Component({
  template: '',
  standalone: false
})
export abstract class BaseFormComponent<T> {
  @Input() formAction!: string;
  @Input() loading$!: Subject<boolean>;
  @Output() validFormResult$ = new EventEmitter<T>();

  @ViewChild(FormComponent, {static: false}) _formComponent!: FormComponent;
  public get formComponent(): FormComponent {
    return this._formComponent;
  }

  protected constructor() {
  }

  abstract get form(): any;

  get formValidators(): ValidatorFn[] {
    return [];
  }

  abstract onValidForm(formValues: { [key: string]: string; }): any;

  abstract handleApiError(apiError: any): any;

  displaySuccess(callback?: () => void) {
    this.formComponent.displaySuccess(callback || (() => {
    }));
  }

  resetForm(value?: any) {
    this.formComponent.resetForm(value);
  }

}
