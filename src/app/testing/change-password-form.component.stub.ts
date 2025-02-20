import {Component, Input} from '@angular/core';
import {ChangePasswordFormComponent} from '../modules/dashboard/components/change-password-form/change-password-form.component';
import {TestBed} from '@angular/core/testing';
import {FormComponentStub} from './form.component.stub';
import {FormComponent} from '../shared/components/dynamic-form/form/form.component';
import {Subject} from 'rxjs';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
    selector: 'app-change-password-form',
    template: '',
    providers: [{ provide: ChangePasswordFormComponent, useClass: ChangePasswordFormComponentStub }],
    standalone: true
})
export class ChangePasswordFormComponentStub {
  _formComponent = TestBed.createComponent(FormComponentStub).componentInstance as FormComponent;
  public get formComponent(): FormComponent {
    return this._formComponent;
  }

  @Input() loading$?: Subject<boolean> = new Subject<boolean>();

  displaySuccess(callback?: () => void) {
    if(callback) callback();
  }

  resetForm(value?: any) {
  }

  handleApiError(apiError: any) {
  }
}
