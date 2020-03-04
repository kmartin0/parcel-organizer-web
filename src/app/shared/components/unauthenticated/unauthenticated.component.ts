import {Component, OnInit} from '@angular/core';
import {faUserLock} from '@fortawesome/free-solid-svg-icons';
import {HOME} from '../../constants/endpoints';
import {Router} from '@angular/router';
import {RedirectService} from '../../services/redirect.service';

@Component({
  selector: 'app-unauthenticated',
  templateUrl: './unauthenticated.component.html',
  styleUrls: ['./unauthenticated.component.css']
})
export class UnauthenticatedComponent implements OnInit {

  faIcons = {
    userLock: faUserLock
  };

  routes = {
    home: HOME
  };

  private redirect: string;

  constructor(private router: Router, private redirectService: RedirectService) {
  }

  ngOnInit() {
    this.redirect = window.location.pathname;
  }

  onSignInClick() {
    this.redirectService.redirect = this.redirect;
  }

}
