import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {DashboardComponent} from './dashboard.component';
import {Observable} from 'rxjs';
import {provideRouter, Router, Routes} from '@angular/router';
import {StubComponent} from '../../../../testing/stub.component';
import {NAV_BAR_STATES, NavComponent} from '../../components/nav/nav.component';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-nav',
  template: '',
  standalone: true
})
export class NavComponentStub {
  @Input() navBarState!: NAV_BAR_STATES;
}

@Component({
  selector: 'app-header',
  template: '',
  standalone: true
})
export class HeaderComponentStub {
  @Input() navBarState!: NAV_BAR_STATES;
  @Input() title!: string;
  @Input() loading$!: Observable<boolean>;
}

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
          redirectTo: 'homeStub',
        },
        {
          path: 'homeStub',
          component: StubComponent,
          data: {title: 'Home Stub'}
        },
        {
          path: 'secondStub',
          component: StubComponent,
          data: {title: 'Second Stub'}
        },
      ]
    },
  ];

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      declarations: [],
      providers: [
        provideRouter(dashboardRoutes)
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(DashboardComponent, {
        remove: {imports: [NavComponent, HeaderComponent]},
        add: {imports: [NavComponentStub, HeaderComponentStub]},
      })
      .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // Navigate to the base path, which should redirect to 'homeStub'
    await router.navigateByUrl('');
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize title with the activated route title', () => {
    expect(component.title).toEqual('Home Stub');
  });

  it('should change title when another dashboard page is opened', async () => {
    // When
    await fixture.ngZone!.run(() => router.navigateByUrl('/secondStub'));

    // Then
    expect(component.title).toEqual('Second Stub');
  });

});
