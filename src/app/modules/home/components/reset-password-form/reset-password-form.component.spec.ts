import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ResetPasswordFormComponent} from './reset-password-form.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';
import {FormComponentStub} from '../../../../testing/form.component.stub';

describe('ResetPasswordFormComponent', () => {
  let component: ResetPasswordFormComponent;
  let fixture: ComponentFixture<ResetPasswordFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ResetPasswordFormComponent],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(ResetPasswordFormComponent, {
        remove: {imports: [FormComponent]},
        add: {imports: [FormComponentStub]},
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
