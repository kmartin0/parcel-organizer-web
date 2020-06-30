import {Component} from '@angular/core';
import {UserFormComponent} from '../shared/components/user-form/user-form.component';
import {TestBed} from '@angular/core/testing';
import {FormComponentStub} from './form.component.stub';
import {FormComponent} from '../shared/components/dynamic-form/form/form.component';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-user-form',
  template: '',
  providers: [{provide: UserFormComponent, useClass: UserFormComponentStub}],
})
export class UserFormComponentStub {
  _formComponent = TestBed.createComponent(FormComponentStub).componentInstance as FormComponent;
  public get formComponent(): FormComponent {
    return this._formComponent;
  }

  displaySuccess(callback?: () => void) {
    callback()
  }

  handleApiError(apiError: any) {
  }
}
