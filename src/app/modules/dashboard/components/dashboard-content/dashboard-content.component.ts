import {Component, OnInit} from '@angular/core';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss'],
  imports: [
    FooterComponent
  ],
  standalone: true
})
export class DashboardContentComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
