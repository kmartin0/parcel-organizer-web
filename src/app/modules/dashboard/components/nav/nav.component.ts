import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {faCubes, faPlusCircle, faUser, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';
import {UserService} from '../../../../shared/services/user.service';
import {ACCOUNT, CREATE_PARCEL, PARCELS} from '../../../../shared/constants/endpoints';

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

  constructor(private userService: UserService) {
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

  onLogout() {
    this.userService.logoutUser();
  }

  private emitNavBarState() {
    this.navBarStateChanged.emit(this.navBarState);
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    const target = event.target;
    if (target.innerWidth < 991) {
      this.navBarState = NAV_BAR_STATES.CLOSED;
      this.emitNavBarState();
    }
  }

}

export enum NAV_BAR_STATES {
  CLIPPED, CLOSED, OPENED
}

// https://golb.hplar.ch/2019/02/fa.html
