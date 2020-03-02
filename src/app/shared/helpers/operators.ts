import {defer, Observable, Subject} from 'rxjs';
import {finalize} from 'rxjs/operators';

export const doOnSubscribe = (onSubscribe: () => void) =>
  <T>(source: Observable<T>) => defer(() => {
    onSubscribe();
    return source;
  });

export function loadingIndicator<T>(indicator: Subject<boolean>): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> => source.pipe(
    doOnSubscribe(() => indicator.next(true)),
    finalize(() => indicator.next(false))
  );
}
