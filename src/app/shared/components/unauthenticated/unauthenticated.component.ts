import {Component, OnInit} from '@angular/core';
import {faUserLock} from '@fortawesome/free-solid-svg-icons';
import {HOME} from '../../constants/endpoints';
import {RedirectService} from '../../services/redirect/redirect.service';

@Component({
  selector: 'app-unauthenticated',
  templateUrl: './unauthenticated.component.html',
  styleUrls: ['./unauthenticated.component.scss']
})
export class UnauthenticatedComponent implements OnInit {

  faIcons = {
    userLock: faUserLock
  };

  routes = {
    home: HOME
  };

  private redirect: string;

  constructor(private redirectService: RedirectService) {
  }

  ngOnInit() {
    this.redirect = window.location.pathname;
  }

  onSignInClick() {
    this.redirectService.redirect = this.redirect;
  }

}
