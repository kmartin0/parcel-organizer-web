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
import {BehaviorSubject, Observable} from 'rxjs';
import {ParcelsSortFilterConfig} from './parcels-sort-filter-config';
import {ParcelDataSourceService} from './parcel-data-source.service';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.css'],
  animations: [trigger('items', enterLeaveTransition)]
})
// TODO: Fix/Think of paging.
export class ParcelsComponent implements OnInit {

  parcels$ = new BehaviorSubject(new Array<Parcel>());
  parcelsFetched = false;

  pagingConfig$ = new BehaviorSubject(new PagingConfig());
  sortAndFilterConfig$ = new BehaviorSubject<ParcelsSortFilterConfig>(null);
  curPageParcels$: Observable<Parcel[]>;

  @ViewChild('parcelsContainer') divView: ElementRef;

  constructor(private parcelService: ParcelService, public dashboardLoadingService: DashboardLoadingService, private route: ActivatedRoute,
              private router: Router, private scrollDispatcher: ScrollDispatcher, private parcelDataSourceService: ParcelDataSourceService) {

    this.curPageParcels$ = parcelDataSourceService.connect(this.parcels$, this.pagingConfig$, this.sortAndFilterConfig$, dashboardLoadingService.loading$);
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
    this.parcels$.next(this.parcels$.getValue().filter(item => item.id !== parcel.id));
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
      this.parcels$.next(value);

    }, error => {
      this.parcelsFetched = true;
    });
  }
}
