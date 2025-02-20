import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {faCubes, faMoon, faPlusCircle, faSignOutAlt, faSun, faUser} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';
import {UserService} from '../../../../shared/services/user/user.service';
import {ACCOUNT, CREATE_PARCEL, PARCELS} from '../../../../shared/constants/endpoints';
import {NavigationStart, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {APP_THEME_MODE, ThemeService} from '../../../../shared/services/theme/theme.service';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  imports: [
    NgClass,
    RouterLinkActive,
    RouterLink,
    FontAwesomeModule,
    NgIf,
    AsyncPipe
  ],
  standalone: true
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
  @Input() navBarState!: NAV_BAR_STATES;
  @Output() navBarStateChanged = new EventEmitter<NAV_BAR_STATES>();
  isMobileView: boolean = false;
  appThemeMode$ = this.themeService.themeMode$;
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
    this.themeService.toggleThemeMode();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const target = event.target as Window;
    if (target && target.innerWidth < this.maxMobileWidth) {
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

  protected readonly APP_THEME_MODE = APP_THEME_MODE;
}

export enum NAV_BAR_STATES {
  CLIPPED, CLOSED, OPENED
}
