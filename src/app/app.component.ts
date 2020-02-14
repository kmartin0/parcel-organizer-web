import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  private formSelector: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.formSelector = formBuilder.group({
      formSelect: ['login']
    });
  }

  public onLoginSuccess() {
    alert('Successful Login');
  }

  public onRegisterSuccess() {
    alert('Successful Register');
  }

}

