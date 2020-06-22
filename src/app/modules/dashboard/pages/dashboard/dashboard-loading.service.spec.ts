import {DashboardLoadingService} from './dashboard-loading.service';
import {TestScheduler} from 'rxjs/testing';

describe('DashboardLoadingService', () => {

  let dashboardLoadingService: DashboardLoadingService;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    dashboardLoadingService = new DashboardLoadingService();

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should emit true when a loading request is pending and false when it stops', () => {
    testScheduler.run(({expectObservable, cold}) => {
      // Given
      const loading$ = dashboardLoadingService.loading$;

      // When
      cold('ab', {
        a: true,
        b: false,
      }).subscribe(methodName => {
        loading$.next(methodName);
      });

      // Then
      expectObservable(loading$).toBe('ab', {
        a: true,
        b: false,
      });
    });
  });

  it('should emit true when the first loading request is pending and false when the last one stops', () => {
    testScheduler.run(({expectObservable, cold}) => {
      // Given
      const loading$ = dashboardLoadingService.loading$;

      const values = {
        a: true,
        b: true,
        c: false,
        d: true,
        e: false,
        f: false,
      };

      const expected = {
        a: true,
        b: false,
      };

      // When
      cold('abcdef', values).subscribe(methodName => {
        loading$.next(methodName);
      });

      // Then
      expectObservable(loading$).toBe('a----b', expected);
    });
  });

  it('should emit multiple requests start and stop when there are no pending requests', () => {
    testScheduler.run(({expectObservable, cold}) => {
      // Given
      const loading$ = dashboardLoadingService.loading$;

      const values = {
        a: true,
        b: false,
        c: true,
        d: true,
        e: false,
        f: false,
      };

      const expected = {
        a: true,
        b: false,
        c: true,
        d: false,
      };

      // When
      cold('abcdef', values).subscribe(methodName => {
        loading$.next(methodName);
      });

      // Then
      expectObservable(loading$).toBe('abc--d', expected);
    });
  });

  it('should log a warning that there can\'t be less than 0 zero requests', () => {
    spyOn(console, 'error').and.callFake(() => {
    });

    testScheduler.run(({expectObservable, cold, flush}) => {
      // Given
      const loading$ = dashboardLoadingService.loading$;

      const values = {
        a: true,
        b: false,
        c: false,
      };

      const expected = {
        a: true,
        b: false
      };

      // When
      cold('abc', values).subscribe(value => {
        loading$.next(value);
      });

      // Then
      expectObservable(loading$).toBe('ab', expected);

      flush();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(dashboardLoadingService.negativeLoadingRequestsMsg);
    });
  });
});
