import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faCubes, faPlusCircle, faUser} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  faIcons = {
    cubes: faCubes,
    plusCircle: faPlusCircle,
    user: faUser
  };

  faIconStyle: Styles = {
    width: '24px',
    height: '24px',
  };

  navBarStates = NAV_BAR_STATES;
  @Input() navBarState: NAV_BAR_STATES = NAV_BAR_STATES.CLOSED;
  @Output() navBarStateChanged = new EventEmitter<NAV_BAR_STATES>();

  constructor() {
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

}

export enum NAV_BAR_STATES {
  CLIPPED, CLOSED, OPENED
}

// https://golb.hplar.ch/2019/02/fa.html
