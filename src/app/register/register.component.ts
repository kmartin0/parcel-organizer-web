import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {passwordMatchValidator} from '../validator/password-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() public registerSuccess = new EventEmitter();

  private registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: passwordMatchValidator('password', 'confirmPassword', 'confirmPassword')
    });
  }

  public ngOnInit() {
  }

  private onRegisterSubmit() {
    this.registerForm.valid ? this.onRegisterSuccess() : this.onRegisterError();
  }

  private onRegisterSuccess() {
    this.registerSuccess.emit();

    setTimeout(() => {
      this.registerForm.reset();
    }, 0);
  }

  private onRegisterError() {
    // alert('Login unsuccessful');
  }

}
