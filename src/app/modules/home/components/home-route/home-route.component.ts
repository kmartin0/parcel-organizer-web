import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-home-route',
  templateUrl: './home-route.component.html',
  styleUrls: ['./home-route.component.scss'],
  imports: [
    RouterOutlet
  ],
  standalone: true
})
export class HomeRouteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
