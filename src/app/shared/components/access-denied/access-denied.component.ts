import {Component, Input, OnInit} from '@angular/core';
import {faLock} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
  imports: [
    FontAwesomeModule
  ],
  standalone: true
})
export class AccessDeniedComponent implements OnInit {

  @Input() message: string = '';

  deniedIcon = faLock;

  constructor() { }

  ngOnInit() {
  }

}
