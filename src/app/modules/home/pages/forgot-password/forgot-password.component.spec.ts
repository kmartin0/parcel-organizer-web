import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ForgotPasswordComponent} from './forgot-password.component';
import {Router} from '@angular/router';
import {UserService} from '../../../../shared/services/user/user.service';
import {Component, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {ForgotPasswordFormComponent} from '../../components/forgot-password-form/forgot-password-form.component';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-forgot-password-form',
  template: '',
  providers: [{provide: ForgotPasswordFormComponent, useClass: ForgotPasswordFormComponentStub}],
  standalone: true
})
export class ForgotPasswordFormComponentStub{
  @Input() loading$!: Subject<boolean>;
}

describe('ForgotPasswordComponent', () => {

  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(() => {
    // Initialize spies
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['resetPassword']);
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      declarations: [],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: userServiceSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(ForgotPasswordComponent, {
        remove: {imports: [ForgotPasswordFormComponent]},
        add: {imports: [ForgotPasswordFormComponentStub]},
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
