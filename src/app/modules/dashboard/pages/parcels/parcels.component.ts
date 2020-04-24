import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../../../shared/anim/enter-leave.anim';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {withLoading} from '../../../../shared/helpers/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {DASHBOARD_CONTENT_WRAPPER_ID} from '../dashboard/dashboard.component';
import {PagingConfig} from './paging-config';
import {BehaviorSubject, Observable} from 'rxjs';
import {ParcelsSortFilterConfig} from './parcels-sort-filter-config';
import {ParcelDataSourceService} from './parcel-data-source.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.scss'],
  animations: [trigger('transition', enterLeaveTransition)]
})
export class ParcelsComponent implements OnInit {

  parcels$ = new BehaviorSubject(new Array<Parcel>());
  parcelsFetched = false;

  pagingConfig$ = new BehaviorSubject(new PagingConfig());
  sortAndFilterConfig$ = new BehaviorSubject<ParcelsSortFilterConfig>(null);
  curPageParcels$: Observable<Parcel[]>;

  @ViewChild('parcelsContainer') divView: ElementRef;

  constructor(private parcelService: ParcelService, public dashboardLoadingService: DashboardLoadingService, private route: ActivatedRoute,
              private router: Router, private scrollDispatcher: ScrollDispatcher, public parcelDataSourceService: ParcelDataSourceService) {
    this.curPageParcels$ = parcelDataSourceService.connect(this.parcels$, this.pagingConfig$, this.sortAndFilterConfig$, dashboardLoadingService.loading$);

    this.curPageParcels$.subscribe(value => {
      console.log(value);
    });
  }

  ngOnInit() {
    this.getParcels();
  }

  onPageChange(newPage: number) {
    const tmpConfig = this.pagingConfig$.getValue();
    tmpConfig.curPage = newPage;
    this.pagingConfig$.next(tmpConfig);

    this.scrollTop();
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
      //   for (let i = 0; i < 7; i++) {
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
