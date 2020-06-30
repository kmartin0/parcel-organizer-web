import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {UnauthenticatedComponent} from './unauthenticated.component';
import {RedirectService} from '../../services/redirect/redirect.service';

describe('UnauthenticatedComponent', () => {

  let redirectService: RedirectService;

  let component: UnauthenticatedComponent;
  let fixture: ComponentFixture<UnauthenticatedComponent>;

beforeEach(() => {
  redirectService = new RedirectService();
});

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnauthenticatedComponent],
      providers: [
        {provide: RedirectService, useValue: redirectService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set redirect to pathname', () => {
    component.onSignInClick();
    expect(redirectService.consume()).toEqual(window.location.pathname);
  });
});
