import {Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  @Input() loading$?: Subject<boolean>;
  @Input() width: string = "100%";

  constructor() {
  }

  ngOnInit() {
  }

}
