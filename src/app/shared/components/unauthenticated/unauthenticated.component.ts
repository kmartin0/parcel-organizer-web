import {Component, OnInit} from '@angular/core';
import {faUserLock} from '@fortawesome/free-solid-svg-icons';
import {HOME} from '../../constants/endpoints';
import {RedirectService} from '../../services/redirect/redirect.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-unauthenticated',
  templateUrl: './unauthenticated.component.html',
  styleUrls: ['./unauthenticated.component.scss'],
  imports: [
    FontAwesomeModule,
    RouterLink
  ],
  standalone: true
})
export class UnauthenticatedComponent implements OnInit {

  faIcons = {
    userLock: faUserLock
  };

  routes = {
    home: HOME
  };

  private redirect: string = '';

  constructor(private redirectService: RedirectService) {
  }

  ngOnInit() {
    this.redirect = window.location.pathname;
  }

  onSignInClick() {
    this.redirectService.redirect = this.redirect;
  }

}
