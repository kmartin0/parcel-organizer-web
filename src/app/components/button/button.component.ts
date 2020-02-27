import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  @Output() onClick = new EventEmitter<any>();
  @Input() loading$?: Subject<boolean>;

  onClickButton(event) {
    this.onClick.emit(event);
  }

  constructor() {
  }

  ngOnInit() {
  }

}
