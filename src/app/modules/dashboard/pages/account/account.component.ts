import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {USER_FORM} from '../../../../shared/components/user-form/user.form';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  loading$ = new Subject<boolean>();
  userForm = USER_FORM;

  constructor() {
  }

  ngOnInit() {
  }

  onValidForm(formValues) {
    console.log('valid form');
  }

  populateForm() {

  }

}
