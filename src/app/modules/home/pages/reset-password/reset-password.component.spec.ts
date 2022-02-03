import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ResetPasswordComponent} from './reset-password.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../shared/services/user/user.service';
import {of} from 'rxjs';

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
      declarations: [ResetPasswordComponent],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: activatedRouteSpy},
        {provide: UserService, useValue: userServiceSpy},
      ],
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
