import {Component, Input} from '@angular/core';
import {TextBoxInputField} from './text-box-input-field';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['../input.scss', './text-input.component.scss'],
  imports: [
    ReactiveFormsModule
  ],
  standalone: true
})
export class TextInputComponent {

  @Input() inputField!: TextBoxInputField;
  @Input() control!: UntypedFormControl;

}
