import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
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
  @Input() width: string = '34px';
  @Input() height: string = '34px';

  spinnerIcon = faSpinner;

  faIconStyle = {
    width: this.width,
    height: this.height,
  };

  constructor() {

  }

  ngOnInit() {

  }
}
