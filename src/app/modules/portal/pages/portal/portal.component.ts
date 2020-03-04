import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../../shared/services/user.service';
import {NAV_BAR_STATES} from '../../components/nav/nav.component';
import {ActivatedRoute, ChildActivationEnd, Router} from '@angular/router';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$ = new Subject();
  title: string;
  navBarState: NAV_BAR_STATES = NAV_BAR_STATES.CLIPPED;
  user = this.userService.getLoggedInUser();

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.setInitialTitle();
    this.initTitleChangeObserver();
  }

  setInitialTitle() {
    this.activatedRoute.firstChild.firstChild.data.subscribe(data => {
      this.title = data.title;
    });
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
}
