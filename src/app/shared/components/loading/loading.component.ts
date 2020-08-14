import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../anim/enter-leave.anim';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [trigger('spinner', enterLeaveTransition)]
})
export class LoadingComponent implements OnInit {

  @Input() loading$?: Observable<boolean>;
  @Input() spinnerSize: number = 34;

  constructor() {

  }

  ngOnInit() {

  }
}
