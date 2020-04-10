import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../../../shared/anim/enter-leave.anim';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {withLoading} from '../../../../shared/helpers/operators';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {isNumeric} from 'rxjs/internal-compatibility';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {DASHBOARD_CONTENT_WRAPPER_ID} from '../dashboard/dashboard.component';
import {PagingConfig} from './paging-config';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {delay, map, switchMap, tap,} from 'rxjs/operators';
import {
  ParcelOrderDirectionEnum,
  ParcelOrderOptionsEnum,
  ParcelSearchOptionsEnum,
  ParcelsSortFilterConfig
} from './parcels-sort-filter-config';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.css'],
  animations: [trigger('items', enterLeaveTransition)]
})
export class ParcelsComponent implements OnInit {

  repoParcels$: BehaviorSubject<Parcel[]>;
  parcelsFetched = false;

  pagingConfig$ = new BehaviorSubject(new PagingConfig());
  sortAndFilterConfig$: BehaviorSubject<ParcelsSortFilterConfig> = new BehaviorSubject(null).pipe(delay(0)) as BehaviorSubject<ParcelsSortFilterConfig>;
  curPageParcels$: BehaviorSubject<Parcel[]>;

  @ViewChild('parcelsContainer') divView: ElementRef;

  constructor(private parcelService: ParcelService, public dashboardLoadingService: DashboardLoadingService, private route: ActivatedRoute,
              private router: Router, private scrollDispatcher: ScrollDispatcher) {

    this.repoParcels$ = new BehaviorSubject(new Array<Parcel>());
    this.curPageParcels$ = new BehaviorSubject<Parcel[]>(new Array<Parcel>());

    const filterSortParcels = combineLatest([this.sortAndFilterConfig$]).pipe(
      switchMap(([sortAndFilterConfig]) => {
        return this.repoParcels$
          .pipe(
            switchMap(repoParcels => this.filterParcels(repoParcels, sortAndFilterConfig)),
            switchMap(filteredParcels => this.sortParcels(filteredParcels, sortAndFilterConfig)),
            tap(filterSortParcels => this.updateMaxPage(filterSortParcels.length)),
          );
      }),
    );

    combineLatest([filterSortParcels, this.pagingConfig$]).pipe(
      map(([filterSortParcels, paging]) => {
        const endIndex = paging.curPage == 1 ? paging.pageSize : paging.curPage * paging.pageSize;
        const startIndex = endIndex - paging.pageSize;

        return filterSortParcels.slice(startIndex, endIndex);
      }),
    ).subscribe(curPageParcels => {
      this.curPageParcels$.next(curPageParcels);
    });
  }

  updateMaxPage(numOfPages: number) {
    const paging = this.pagingConfig$.value;
    paging.setMaxPagesBySize(numOfPages);
    this.pagingConfig$.next(paging);
  }

  sortParcels(parcels: Parcel[], filters: ParcelsSortFilterConfig): Observable<Parcel[]> {
    return new Observable<Parcel[]>(subscriber => {
      if (!filters) {
        subscriber.next(parcels);
      } else {
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
      }
      subscriber.complete();
    }).pipe(withLoading(this.dashboardLoadingService.loading$));
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

  filterParcels(parcels: Parcel[], filters: ParcelsSortFilterConfig): Observable<Parcel[]> {
    return new Observable<Parcel[]>(subscriber => {
      if (!filters) {
        subscriber.next(parcels);
      } else {
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
    }).pipe(withLoading(this.dashboardLoadingService.loading$),);
  }

  /**
   * Check if the parcel status matches a filter.
   *
   * @param parcel
   * @param statusFilters
   * @return True when a filter matches the parcel status. False when parcel status does not match any filters.
   */
  isParcelStatusMatchingFilter(parcel: Parcel, statusFilters: ParcelStatusEnum[]): boolean {
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

    return propertyToMatch ? propertyToMatch.toLowerCase().startsWith(query) : false;
  }

  pageChangeParcels() {

  }

  ngOnInit() {
    this.getParcels();
    this.observeQueryParams();
  }

  observeQueryParams() {
    this.route
      .queryParams
      .subscribe(params => {
        if ('page' in params) {
          const pageParam = params.page;
          if (isNumeric(pageParam)) {
            // this.pagingConfig.curPage = Number(pageParam);

            const tmpConfig = this.pagingConfig$.getValue();
            tmpConfig.curPage = Number(pageParam);
            this.pagingConfig$.next(tmpConfig);
          }
        }
      });
  }

  onPageChange(newPage: number) {
    const queryParams: Params = {page: newPage};

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }).then(value => this.scrollTop());
  }

  scrollTop() {
    this.scrollDispatcher.scrollContainers.forEach((value, key) => {
      if (key.getElementRef().nativeElement.id == DASHBOARD_CONTENT_WRAPPER_ID) {
        key.scrollTo({top: 0, behavior: 'auto'});
      }
    });
  }

  onParcelDeleted(parcel: Parcel) {
    this.repoParcels$.next(this.repoParcels$.getValue().filter(item => item.id !== parcel.id));
  }

  private getParcels() {
    this.parcelService.getParcels().pipe(
      withLoading(this.dashboardLoadingService.loading$),
      // map(value => {
      //   let tmpParcels = value;
      //   for (let i = 0; i < 10; i++) {
      //     tmpParcels = tmpParcels.concat(tmpParcels);
      //   }
      //   console.log(tmpParcels.length);
      //   return tmpParcels;
      // })
    ).subscribe(value => {
      this.parcelsFetched = true;
      this.repoParcels$.next(value);

    }, error => {
      this.parcelsFetched = true;
    });
  }
}
