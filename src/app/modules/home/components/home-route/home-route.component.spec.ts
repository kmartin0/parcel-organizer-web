import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HomeRouteComponent} from './home-route.component';

describe('HomeRouteComponent', () => {
  let component: HomeRouteComponent;
  let fixture: ComponentFixture<HomeRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeRouteComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
