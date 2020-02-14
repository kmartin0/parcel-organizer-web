import {Component, Host, Input, OnInit, Optional, Self} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {ErrorMessageService} from '../service/error-message.service';
import {EMPTY, merge, Observable} from 'rxjs';
import {FormSubmitDirective} from '../directive/form-submit.directive';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements ControlValueAccessor, OnInit {

  @Input() disabled: boolean;
  @Input() label: string;
  @Input() id: string;
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'submit';
  @Input() value: string = '';
  errorMessages: string[];

  submit$: Observable<Event>;

  constructor(
    @Self()
    @Optional()
    private ngControl: NgControl,
    @Optional() @Host() private form: FormSubmitDirective,
    private errorMessageService: ErrorMessageService,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
  }

  ngOnInit(): void {
    if (this.ngControl) {
      merge(
        this.submit$,
        this.ngControl.valueChanges
      ).subscribe(value => {

        if (value instanceof Event) {
          this.ngControl.control.markAsDirty();
        }

        const controlErrors = this.ngControl.errors;
        if (controlErrors) {
          this.errorMessages = this.errorMessageService.getErrorMessagesForValidationErrors(controlErrors);
        } else {
          this.errorMessages = null;
        }
      });
    }
  }

  writeValue(value: any) {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private onChange(value: any) {
  }

  private onTouched() {
  }

}

