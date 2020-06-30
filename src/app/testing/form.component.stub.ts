import {Component} from '@angular/core';
import {FormComponent} from '../shared/components/dynamic-form/form/form.component';
import {FormControl} from '@angular/forms';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-form',
  template: '',
  providers: [{provide: FormComponent, useClass: FormComponentStub}]
})
export class FormComponentStub {
  getFormControl(key: string): FormControl {
    return new FormControl();
  }

  resetForm(value?: any) {
  }

  setError(formControlKey: string, error: string) {
  };

}
