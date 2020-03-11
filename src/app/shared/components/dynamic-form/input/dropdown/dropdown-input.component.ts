import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DropdownInputField} from './dropdown-input-field';

@Component({
  selector: 'app-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['../input.css', './dropdown-input.component.css']
})
export class DropdownInputComponent {

  @Input() inputField: DropdownInputField;
  @Input() control: FormControl;

}
