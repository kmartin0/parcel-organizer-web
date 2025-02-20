import {Component, Input} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {DropdownInputField} from './dropdown-input-field';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['../input.scss', './dropdown-input.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  standalone: true
})
export class DropdownInputComponent {

  @Input() inputField!: DropdownInputField;
  @Input() control!: UntypedFormControl;

}
