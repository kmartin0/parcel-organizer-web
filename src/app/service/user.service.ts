import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseApiService} from './base-api.service';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private baseApiService: BaseApiService) {
  }

  registerUser(user: User): Observable<User> {
    return this.baseApiService.makePost('users', user);
  }

}


