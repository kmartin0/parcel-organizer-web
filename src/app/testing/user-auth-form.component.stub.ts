import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormComponentStub} from './form.component.stub';
import {FormComponent} from '../shared/components/dynamic-form/form/form.component';
import {UserAuthFormComponent} from '../shared/components/user-authentication-form/user-auth-form.component';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-user-auth-form',
  template: '',
  providers: [{provide: UserAuthFormComponent, useClass: UserAuthFormComponentStub}],
})
export class UserAuthFormComponentStub {
  _formComponent = TestBed.createComponent(FormComponentStub).componentInstance as FormComponent;
  public get formComponent(): FormComponent {
    return this._formComponent;
  }

  displaySuccess(callback?: () => void) {
    callback();
  }

  handleApiError(apiError: any) {
  }
}
