import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../shared/services/theme/theme.service';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet
  ],
  standalone: true
})

export class AppComponent implements OnInit {

  constructor(private themeService: ThemeService) {
  }

  ngOnInit(): void {
  }

}



