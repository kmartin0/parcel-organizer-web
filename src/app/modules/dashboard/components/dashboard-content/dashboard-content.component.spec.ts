import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DashboardContentComponent} from './dashboard-content.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('DashboardContentComponent', () => {
  let component: DashboardContentComponent;
  let fixture: ComponentFixture<DashboardContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardContentComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
