import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../anim/enter-leave.anim';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [trigger('spinner', enterLeaveTransition)],
  imports: [
    MatProgressSpinner,
    NgIf,
    AsyncPipe
  ],
  standalone: true
})
export class LoadingComponent implements OnInit {

  @Input() loading$?: Observable<boolean>;
  @Input() spinnerSize = 28;

  constructor() {

  }

  ngOnInit() {

  }
}
