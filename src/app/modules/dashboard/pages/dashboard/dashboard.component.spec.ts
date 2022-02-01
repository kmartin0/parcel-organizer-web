import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {DashboardComponent} from './dashboard.component';
import {RouterTestingModule} from '@angular/router/testing';
import {DashboardLoadingService} from './dashboard-loading.service';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router, Routes} from '@angular/router';
import {StubComponent} from '../../../../testing/stub.component';

describe('DashboardComponent', () => {

  const dashboardRoutes: Routes = [
    {
      path: '',
      pathMatch: 'prefix',
      component: DashboardComponent,
      children: [
        {
          path: '',
          pathMatch: 'prefix',
          children: [
            {
              path: 'stub',
              component: StubComponent,
              data: {title: 'stub title'}
            },
          ]
        }
      ]
    },
  ];

  let initialActivatedRouteMock = {
    component: DashboardComponent,
    snapshot: {
      data: {},
      firstChild: {
        data: {
          title: 'initial title'
        }
      },
    },
  };

  let dashboardLoadingServiceSpy: jasmine.SpyObj<DashboardLoadingService>;

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;

  beforeEach(() => {
    // Initialize spies
    dashboardLoadingServiceSpy = jasmine.createSpyObj('DashboardLoadingService', [], [{loading$: new Subject()}]);
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(dashboardRoutes)],
      declarations: [DashboardComponent],
      providers: [{provide: ActivatedRoute, useValue: initialActivatedRouteMock}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
  });

  it('should initialize title with the activated route title', () => {
    expect(component.title).toEqual('initial title');
  });

  it('should change title when another dashboard page is opened', async () => {
    // When
    await fixture.ngZone.run(() => router.navigateByUrl('stub'));

    // Then
    expect(component.title).toEqual('stub title');
  });

});
