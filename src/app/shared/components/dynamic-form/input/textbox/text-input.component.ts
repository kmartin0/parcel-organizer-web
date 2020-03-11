import {Component, Input} from '@angular/core';
import {TextBoxInputField} from './text-box-input-field';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['../input.css', './text-input.component.css']
})
export class TextInputComponent {

  @Input() inputField: TextBoxInputField;
  @Input() control: FormControl;

}
