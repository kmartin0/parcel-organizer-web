import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {faCubes, faPlusCircle, faUser, faSignOutAlt, faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';
import {UserService} from '../../../../shared/services/user/user.service';
import {ACCOUNT, CREATE_PARCEL, PARCELS} from '../../../../shared/constants/endpoints';
import {NavigationStart, Router} from '@angular/router';
import {ThemeService} from '../../../../shared/services/theme/theme.service';

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
    logout: faSignOutAlt,
    moon: faMoon,
    sun: faSun,
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
  isDarkTheme$ = this.themeService.isDarkTheme;
  maxMobileWidth = 991;

  constructor(private userService: UserService, private router: Router, private themeService: ThemeService) {
    this.initNavigationListener();
    this.isMobileView = window.innerWidth < this.maxMobileWidth;
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

  onToggleTheme() {
    this.themeService.toggleTheme();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const target = event.target;
    if (target.innerWidth < this.maxMobileWidth) {
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

  private emitNavBarState(navBarState: NAV_BAR_STATES) {
    this.navBarState = navBarState;
    this.navBarStateChanged.emit(this.navBarState);
  }

}

export enum NAV_BAR_STATES {
  CLIPPED, CLOSED, OPENED
}
