import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ForgotPasswordFormComponent} from './forgot-password-form.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';
import {FormComponentStub} from '../../../../testing/form.component.stub';

describe('ForgotPasswordFormComponent', () => {
  let component: ForgotPasswordFormComponent;
  let fixture: ComponentFixture<ForgotPasswordFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ForgotPasswordFormComponent],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(ForgotPasswordFormComponent, {
        remove: {imports: [FormComponent]},
        add: {imports: [FormComponentStub]},
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
