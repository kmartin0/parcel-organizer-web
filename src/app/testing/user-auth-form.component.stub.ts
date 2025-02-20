import {Component, Input} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormComponentStub} from './form.component.stub';
import {FormComponent} from '../shared/components/dynamic-form/form/form.component';
import {UserAuthFormComponent} from '../shared/components/user-authentication-form/user-auth-form.component';
import {Subject} from 'rxjs';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-user-auth-form',
  template: '',
  providers: [{provide: UserAuthFormComponent, useClass: UserAuthFormComponentStub}],
  standalone: true
})
export class UserAuthFormComponentStub {
  _formComponent = TestBed.createComponent(FormComponentStub).componentInstance as FormComponent;
  public get formComponent(): FormComponent {
    return this._formComponent;
  }

  @Input() loading$?: Subject<boolean> = new Subject<boolean>();

  displaySuccess(callback?: () => void) {
    if (callback) callback();
  }

  handleApiError(apiError: any) {
  }
}
