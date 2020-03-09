import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardLoadingService {

  private readonly _loading$: BehaviorSubject<boolean>;
  private pendingRequests = 0;

  get loading$(): BehaviorSubject<boolean> {
    return this._loading$;
  }

  constructor() {
    this._loading$ = new BehaviorSubject<boolean>(false).pipe(
      map(value => {
        value ? this.pendingRequests++ : this.pendingRequests--;
        if (this.pendingRequests < 0) {
          this.pendingRequests = 0;
        }
        return this.pendingRequests > 0; // If there are no pending requests the emitted value is false
      })) as BehaviorSubject<boolean>;
  }
}
