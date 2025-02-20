import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {Styles} from '@fortawesome/fontawesome-svg-core';
import {NAV_BAR_STATES} from '../nav/nav.component';
import {Observable} from 'rxjs';
import {NgClass} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {LoadingComponent} from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    NgClass,
    FontAwesomeModule,
    LoadingComponent
  ],
  standalone: true
})
export class HeaderComponent implements OnInit {

  navBarStates = NAV_BAR_STATES;
  @Input() navBarState!: NAV_BAR_STATES;
  @Input() title!: string;
  @Input() loading$!: Observable<boolean>;
  @Output() changeNavBarState = new EventEmitter<NAV_BAR_STATES>();

  faIcons = {
    hamburger: faBars
  };

  faIconStyle: Styles = {
    width: '100%',
    height: '100%',
  };

  constructor() {
  }

  ngOnInit() {
  }

  toggleNavBarClip() {
    switch (this.navBarState) {
      case NAV_BAR_STATES.CLIPPED: {
        this.changeNavBarState.emit(this.navBarStates.CLOSED);
        break;
      }
      case NAV_BAR_STATES.CLOSED:
      case NAV_BAR_STATES.OPENED: {
        this.changeNavBarState.emit(this.navBarStates.CLIPPED);
      }
    }
  }
}
