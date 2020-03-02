import {Component} from '@angular/core';
import {UserService} from '../shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  isUserLoggedIn = this.userService.isUserLoggedIn();

  constructor(private userService: UserService) {
  }

}



