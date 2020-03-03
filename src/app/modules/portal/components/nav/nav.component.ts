import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faCubes, faPlusCircle, faUser, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';
import {UserService} from '../../../../shared/services/user.service';
import {Router} from '@angular/router';
import {ACCOUNT, CREATE_PARCEL, HOME, PARCELS} from '../../../../shared/constants/endpoints';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
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
  @Input() navBarState: NAV_BAR_STATES = NAV_BAR_STATES.CLOSED;
  @Output() navBarStateChanged = new EventEmitter<NAV_BAR_STATES>();

  constructor(private userService: UserService, private router: Router) {
    console.log(router.config)
  }

  ngOnInit() {
    this.emitNavBarState();
  }

  onNavMouseEnter() {
    if (this.navBarState != NAV_BAR_STATES.CLIPPED) {
      this.navBarState = NAV_BAR_STATES.OPENED;
      this.emitNavBarState();
    }
  }

  onNavMouseLeave() {
    if (this.navBarState != NAV_BAR_STATES.CLIPPED) {
      this.navBarState = NAV_BAR_STATES.CLOSED;
      this.emitNavBarState();
    }
  }

  emitNavBarState() {
    this.navBarStateChanged.emit(this.navBarState);
  }

  onLogout() {
    this.userService.logoutUser();
    this.router.navigate([HOME]);
  }

}

export enum NAV_BAR_STATES {
  CLIPPED, CLOSED, OPENED
}

// https://golb.hplar.ch/2019/02/fa.html
