import {Component} from '@angular/core';
import {ChangePasswordFormComponent} from '../modules/dashboard/components/change-password-form/change-password-form.component';
import {TestBed} from '@angular/core/testing';
import {FormComponentStub} from './form.component.stub';
import {FormComponent} from '../shared/components/dynamic-form/form/form.component';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-change-password-form',
  template: '',
  providers: [{provide: ChangePasswordFormComponent, useClass: ChangePasswordFormComponentStub}],
})
export class ChangePasswordFormComponentStub {
  _formComponent = TestBed.createComponent(FormComponentStub).componentInstance as FormComponent;
  public get formComponent(): FormComponent {
    return this._formComponent;
  }

  displaySuccess(callback?: () => void) {
  }

  handleApiError(apiError: any) {
  }
}
