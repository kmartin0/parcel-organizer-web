import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../../shared/services/user.service';
import {NAV_BAR_STATES} from '../../components/nav/nav.component';
import {ActivatedRoute, ChildActivationEnd, Router} from '@angular/router';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {DashboardLoadingService} from './dashboard-loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashboardContentWrapperId = DASHBOARD_CONTENT_WRAPPER_ID;
  title: string;
  navBarState: NAV_BAR_STATES = NAV_BAR_STATES.CLOSED;
  user = this.userService.getLoggedInUser();
  loading$: Observable<boolean>;

  private ngUnsubscribe$ = new Subject();

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router,
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
        filter(e => e instanceof ChildActivationEnd && e.snapshot.component === this.activatedRoute.component),
        map(ev => (ev as ChildActivationEnd).snapshot.firstChild.firstChild.data),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe(data => {
        this.title = data.title;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  private setInitialTitle() {
    this.activatedRoute.firstChild.firstChild.data.subscribe(data => {
      this.title = data.title;
    });
  }
}

export const DASHBOARD_CONTENT_WRAPPER_ID = "dashboard-content-wrapper";
