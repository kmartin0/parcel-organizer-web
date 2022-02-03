import {Component} from '@angular/core';
import {ParcelFormComponent} from '../modules/dashboard/components/parcel-form/parcel-form.component';
import {TestBed} from '@angular/core/testing';
import {FormComponentStub} from './form.component.stub';
import {FormComponent} from '../shared/components/dynamic-form/form/form.component';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-parcel-form',
  template: '',
  providers: [{provide: ParcelFormComponent, useClass: ParcelFormComponentStub}],
})
export class ParcelFormComponentStub {
  _formComponent = TestBed.createComponent(FormComponentStub).componentInstance as FormComponent;
  public get formComponent(): FormComponent {
    return this._formComponent;
  }

  displaySuccess(callback?: () => void) {
    if (callback) callback();
  }

  resetForm(value?: any) {
  }

  handleApiError(apiError: any) {
  }
}
