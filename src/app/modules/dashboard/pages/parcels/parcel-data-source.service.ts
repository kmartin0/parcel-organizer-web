import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {Parcel} from '../../../../shared/models/parcel';
import {PagingConfig} from './paging-config';
import {
  ParcelOrderDirectionEnum,
  ParcelOrderOptionsEnum,
  ParcelSearchOptionsEnum,
  ParcelsSortFilterConfig
} from './parcels-sort-filter-config';
import {map, share, switchMap, tap} from 'rxjs/operators';
import {withLoading} from '../../../../shared/helpers/operators';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
@Injectable({
  providedIn: 'root'
})
export class ParcelDataSourceService {

  constructor() {
  }

  connect(parcels$: Observable<Parcel[]>, paging$: BehaviorSubject<PagingConfig>, sortAndFilter$: Observable<ParcelsSortFilterConfig>, loading$?: Subject<boolean>): Observable<Parcel[]> {


    const filterSortParcels = combineLatest([sortAndFilter$]).pipe(
      switchMap(([sortAndFilterConfig]) => {
        return parcels$
          .pipe(
            switchMap(parcels => this.filterParcels(parcels, sortAndFilterConfig, loading$)),
            switchMap(filteredParcels => this.sortParcels(filteredParcels, sortAndFilterConfig, loading$)),
            tap(filterSortParcels => {
              setTimeout(() => {
                const tmpPaging = paging$.value;
                tmpPaging.setMaxPagesBySize(filterSortParcels.length);
                tmpPaging.curPage = 1;
                paging$.next(tmpPaging);
              }, 10);
            }),
          );
      }),
    );

    return combineLatest([filterSortParcels, paging$]).pipe(
      map(([filterSortParcels, paging]) => {
        const endIndex = paging.curPage == 1 ? paging.pageSize : paging.curPage * paging.pageSize;
        const startIndex = endIndex - paging.pageSize;

        return filterSortParcels.slice(startIndex, endIndex);
      }),
    ).pipe(share());
  }

  sortParcels(parcels: Parcel[], filters: ParcelsSortFilterConfig, loading$: Subject<boolean>): Observable<Parcel[]> {
    return new Observable<Parcel[]>(subscriber => {
      if (!filters) {
        subscriber.next(parcels);
      } else {
        console.log('...sorting', parcels.length);
                subscriber.next(parcels.sort((a, b) => {
          let valueA = this.parcelOrderByAccessor(a, filters.orderBy);
          let valueB = this.parcelOrderByAccessor(b, filters.orderBy);

          let result = 0;
          if (valueA != null && valueB != null) {
            // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
            if (valueA > valueB) {
              result = 1;
            } else if (valueA < valueB) {
              result = -1;
            }
          } else if (valueA != null) {
            result = 1;
          } else if (valueB != null) {
            result = -1;
          }

          return result * (filters.orderDirection == ParcelOrderDirectionEnum.ASCENDING ? 1 : -1);
        }));
        console.log('...sorting done');
      }
      subscriber.complete();
    }).pipe(withLoading(loading$));
  }

  parcelOrderByAccessor(parcel: Parcel, orderBy: ParcelOrderOptionsEnum) {
    switch (orderBy) {
      case ParcelOrderOptionsEnum.TITLE:
        return parcel.title;
      case ParcelOrderOptionsEnum.SENDER:
        return parcel.sender;
      case ParcelOrderOptionsEnum.COURIER:
        return parcel.courier;
      case ParcelOrderOptionsEnum.LAST_UPDATED:
        return parcel.lastUpdated;
      case ParcelOrderOptionsEnum.STATUS:
        return parcel.parcelStatus.status;
    }
  }

  private filterParcels(parcels: Parcel[], filters: ParcelsSortFilterConfig, loading$?: Subject<boolean>): Observable<Parcel[]> {
    return new Observable<Parcel[]>(subscriber => {
      if (!filters) {
        subscriber.next(parcels);
      } else {
        console.log('...filtering', parcels.length);
        subscriber.next(
          parcels.filter(parcel => {
            // Filter the parcel if the parcel status matches a filter from the status filters.
            if (this.isParcelStatusMatchingFilter(parcel, filters.statusFilters)) {
              return false;
            }

            // Filter the parcel if the start of the search by property doesn't match the search query.
            return filters.searchQuery ? this.isParcelMatchingQuery(parcel, filters.searchQuery, filters.searchBy) : true;
          })
        );
      }
      subscriber.complete();
    }).pipe(withLoading(loading$));
  }

  /**
   * Check if the parcel status matches a filter.
   *
   * @param parcel
   * @param statusFilters
   * @return True when a filter matches the parcel status. False when parcel status does not match any filters.
   */
  private isParcelStatusMatchingFilter(parcel: Parcel, statusFilters: ParcelStatusEnum[]): boolean {
    return !!statusFilters.find(statusFilter => statusFilter == parcel.parcelStatus.status);
  }

  /**
   * Match query against parcel property using ParcelSearchOptionsEnum.
   *
   * @param parcel
   * @param query
   * @param searchBy
   */
  isParcelMatchingQuery(parcel: Parcel, query: string, searchBy: ParcelSearchOptionsEnum): boolean {
    if (!query) {
      return false;
    }

    let propertyToMatch: string;
    switch (searchBy) {
      case ParcelSearchOptionsEnum.COURIER:
        propertyToMatch = parcel.courier;
        break;
      case ParcelSearchOptionsEnum.SENDER:
        propertyToMatch = parcel.sender;
        break;
      case ParcelSearchOptionsEnum.TITLE:
        propertyToMatch = parcel.title;
    }

    return propertyToMatch ? propertyToMatch.toLowerCase().startsWith(query.toLowerCase()) : false;
  }

}
