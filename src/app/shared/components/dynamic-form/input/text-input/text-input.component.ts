import {Component, Input, OnInit} from '@angular/core';
import {TextBoxInputField} from '../text-box-input-field';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {

  @Input() inputField: TextBoxInputField;
  @Input() control: FormControl;

  constructor() {
  }

  ngOnInit() {

  }

}
