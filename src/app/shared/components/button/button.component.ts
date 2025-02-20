import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {AsyncPipe, NgClass} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [
    NgClass,
    AsyncPipe,
    MatButton
  ],
  standalone: true
})
export class ButtonComponent {

  @Input() loading$?: Observable<boolean>;
  @Input() width: string = '100%';

  constructor() {
  }

}
