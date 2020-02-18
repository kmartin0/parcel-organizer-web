import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  @Output() onClick = new EventEmitter<MouseEvent>();

  onClickButton(event) {
    this.onClick.emit(event);
  }

  constructor() {
  }

  ngOnInit() {
  }

}
