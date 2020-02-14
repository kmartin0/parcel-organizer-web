import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() public loginSuccess = new EventEmitter();

  private loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public ngOnInit() {
  }

  private onLoginSubmit() {
    this.loginForm.valid ? this.onLoginSuccess() : this.onLoginError();
  }

  private onLoginSuccess() {
    this.loginSuccess.emit();

    setTimeout(() => {
      this.loginForm.reset();
    }, 0);
  }

  private onLoginError() {
    // alert('Login unsuccessful');
  }

}
