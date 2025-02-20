import {Component, Input} from '@angular/core';
import {UserFormComponent} from '../shared/components/user-form/user-form.component';
import {TestBed} from '@angular/core/testing';
import {FormComponentStub} from './form.component.stub';
import {FormComponent} from '../shared/components/dynamic-form/form/form.component';
import {Subject} from 'rxjs';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-user-form',
  template: '',
  providers: [{provide: UserFormComponent, useClass: UserFormComponentStub}],
  standalone: true
})
export class UserFormComponentStub {
  _formComponent = TestBed.createComponent(FormComponentStub).componentInstance as FormComponent;
  public get formComponent(): FormComponent {
    return this._formComponent;
  }

  @Input() loading$?: Subject<boolean> = new Subject<boolean>();

  constructor() {
  }

  displaySuccess(callback?: () => void) {
    if (callback) callback()
  }

  resetForm(value?: any) {
  }

  handleApiError(apiError: any) {
  }
}
