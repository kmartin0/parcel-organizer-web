import {Component, Input} from '@angular/core';
import {TextBoxInputField} from './text-box-input-field';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['../input.scss', './text-input.component.scss']
})
export class TextInputComponent {

  @Input() inputField: TextBoxInputField;
  @Input() control: FormControl;

}
