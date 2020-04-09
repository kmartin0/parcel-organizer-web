import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {filter, share, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardLoadingService {
  private readonly _loading$: Subject<boolean>;

  get loading$(): Subject<boolean> {
    return this._loading$;
  }

  private loadingRequests = 0;

  constructor() {
    this._loading$ = new Subject<boolean>().pipe(
      filter(value => {
        // console.log(value);
        value ? this.loadingRequests++ : this.loadingRequests--;
        if (this.loadingRequests == 1 && value) {
          return true;
        }
        if (this.loadingRequests == 0 && !value) {
          return true;
        }
        if (this.loadingRequests < 0) {
          console.error('Warning: loading requests is below zero');
        }
        return false;
      }),
      share(),
      shareReplay(1)
    ) as Subject<boolean>;

    // Dummy subscriber so that filter is always ran.
    this.loading$.subscribe();
  }
}