import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  isDarkTheme$ = this.themeService.isDarkTheme;

  constructor(private themeService: ThemeService) {
  }

  ngOnInit(): void {
  }

}



