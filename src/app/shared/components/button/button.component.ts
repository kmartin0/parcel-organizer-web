import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() loading$?: Observable<boolean>;
  @Input() width: string = '100%';

  constructor() {
  }

}
