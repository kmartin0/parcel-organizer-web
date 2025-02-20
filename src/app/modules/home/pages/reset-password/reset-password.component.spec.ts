import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ResetPasswordComponent} from './reset-password.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../shared/services/user/user.service';
import {of, Subject} from 'rxjs';
import {Component, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {ResetPasswordFormComponent} from '../../components/reset-password-form/reset-password-form.component';


@Component({
  selector: 'app-reset-password-form',
  template: '',
  providers: [{provide: ResetPasswordFormComponent, useClass: ResetPasswordFormComponentStub}],
  standalone: true
})
export class ResetPasswordFormComponentStub {
  @Input() loading$?: Subject<boolean> = new Subject<boolean>();
}

describe('ResetPasswordComponent', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(() => {
    // Initialize spies
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {queryParams: of({token: 'token'})});
    userServiceSpy = jasmine.createSpyObj('UserService', ['resetPassword']);
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      declarations: [],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: activatedRouteSpy},
        {provide: UserService, useValue: userServiceSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(ResetPasswordComponent, {
        remove: {imports: [ResetPasswordFormComponent]},
        add: {imports: [ResetPasswordFormComponentStub]},
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
