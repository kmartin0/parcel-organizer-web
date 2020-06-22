import {Component, OnDestroy, OnInit} from '@angular/core';
import {NAV_BAR_STATES} from '../../components/nav/nav.component';
import {ActivatedRoute, ChildActivationEnd, Router} from '@angular/router';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {DashboardLoadingService} from './dashboard-loading.service';
import {getActivatedRouteTitle} from '../../../../shared/helpers/routing.helper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashboardContentWrapperId = DASHBOARD_CONTENT_WRAPPER_ID;
  title: string;
  navBarState: NAV_BAR_STATES = NAV_BAR_STATES.CLOSED;
  loading$: Observable<boolean>;

  private ngUnsubscribe$ = new Subject();

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private loadingService: DashboardLoadingService) {
    this.loading$ = loadingService.loading$;
  }

  ngOnInit() {
    this.setInitialTitle();
    this.initTitleChangeObserver();
  }

  initTitleChangeObserver() {
    this.router.events
      .pipe(
        filter(e => e instanceof ChildActivationEnd && e.snapshot.component === DashboardComponent),
        map(ev => {
         return  getActivatedRouteTitle((ev as ChildActivationEnd).snapshot)
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe(title => {
        this.title = title;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  private setInitialTitle() {
    this.title = getActivatedRouteTitle(this.activatedRoute.snapshot);
  }
}

export const DASHBOARD_CONTENT_WRAPPER_ID = 'dashboard-content-wrapper';
