import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {faCubes, faPlusCircle, faUser, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';
import {UserService} from '../../../../shared/services/user.service';
import {ACCOUNT, CREATE_PARCEL, PARCELS} from '../../../../shared/constants/endpoints';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  faIcons = {
    cubes: faCubes,
    plusCircle: faPlusCircle,
    user: faUser,
    logout: faSignOutAlt
  };

  faIconStyle: Styles = {
    width: '24px',
    height: '24px'
  };

  navRoutes = {
    parcels: PARCELS,
    createParcel: CREATE_PARCEL,
    account: ACCOUNT
  };

  navBarStates = NAV_BAR_STATES;
  @Input() navBarState: NAV_BAR_STATES;
  @Output() navBarStateChanged = new EventEmitter<NAV_BAR_STATES>();
  isMobileView: boolean = false;

  constructor(private userService: UserService, private router: Router) {
    this.initNavigationListener();
    this.isMobileView = window.innerWidth < 991;
  }

  ngOnInit() {
    this.emitNavBarState(NAV_BAR_STATES.CLOSED);
  }

  onNavMouseEnter() {
    if (!this.isMobileView && this.navBarState != NAV_BAR_STATES.CLIPPED) {
      this.emitNavBarState(NAV_BAR_STATES.OPENED);
    }
  }

  onNavMouseLeave() {
    if (!this.isMobileView && this.navBarState != NAV_BAR_STATES.CLIPPED) {
      this.emitNavBarState(NAV_BAR_STATES.CLOSED);
    }
  }

  onLogout() {
    this.userService.logoutUser();
  }

  private emitNavBarState(navBarState: NAV_BAR_STATES) {
    this.navBarState = navBarState;
    this.navBarStateChanged.emit(this.navBarState);
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    const target = event.target;
    if (target.innerWidth < 991) {
      this.isMobileView = true;
      this.emitNavBarState(NAV_BAR_STATES.CLOSED);
    } else {
      this.isMobileView = false;
    }
  }

  initNavigationListener() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        if (this.isMobileView) {
          this.emitNavBarState(NAV_BAR_STATES.CLOSED);
        }
      }
    });
  }

}

export enum NAV_BAR_STATES {
  CLIPPED, CLOSED, OPENED
}

// https://golb.hplar.ch/2019/02/fa.html
