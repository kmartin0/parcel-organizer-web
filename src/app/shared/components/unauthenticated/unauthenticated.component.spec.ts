import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {UnauthenticatedComponent} from './unauthenticated.component';
import {RedirectService} from '../../services/redirect/redirect.service';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';

describe('UnauthenticatedComponent', () => {

  let redirectService: RedirectService;

  let component: UnauthenticatedComponent;
  let fixture: ComponentFixture<UnauthenticatedComponent>;

  beforeEach(() => {
    redirectService = new RedirectService();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UnauthenticatedComponent],
      declarations: [],
      providers: [
        {provide: RedirectService, useValue: redirectService},
        {provide: ActivatedRoute, useValue: {params: of({})}}
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
