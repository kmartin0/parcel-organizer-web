import {Component, Input} from '@angular/core';
import {ParcelFormComponent} from '../modules/dashboard/components/parcel-form/parcel-form.component';
import {FormComponentStub} from './form.component.stub';
import {FormComponent} from '../shared/components/dynamic-form/form/form.component';
import {Subject} from 'rxjs';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
    selector: 'app-parcel-form',
    template: '',
    providers: [{ provide: ParcelFormComponent, useClass: ParcelFormComponentStub }],
    standalone: true
})
export class ParcelFormComponentStub {
  // _formComponent = TestBed.createComponent(FormComponentStub).componentInstance as FormComponent;
  _formComponent = new FormComponentStub() as FormComponent;
  public get formComponent(): FormComponent {
    return this._formComponent;
  }

  @Input() loading$?: Subject<boolean> = new Subject<boolean>();

  displaySuccess(callback?: () => void) {
    if (callback) callback();
  }

  resetForm(value?: any) {
  }

  handleApiError(apiError: any) {
  }
}
