import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../shared/services/user.service';
import {NAV_BAR_STATES} from '../../components/nav/nav.component';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit {

  navBarState: NAV_BAR_STATES = NAV_BAR_STATES.CLOSED;
  user = this.userService.getLoggedInUser();

  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }

  logout() {
    this.userService.logoutUser();
  }

}
