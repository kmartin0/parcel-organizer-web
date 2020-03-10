import {Component, Input, OnInit} from '@angular/core';
import {faLock} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  @Input() message: string;

  deniedIcon = faLock;

  constructor() { }

  ngOnInit() {
  }

}
