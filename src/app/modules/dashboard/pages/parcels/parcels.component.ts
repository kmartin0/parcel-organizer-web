import {Component, OnInit} from '@angular/core';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelService} from '../../../../shared/services/parcel/parcel.service';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../../../shared/anim/enter-leave.anim';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {withLoading} from '../../../../shared/helpers/operators';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {DASHBOARD_CONTENT_WRAPPER_ID} from '../dashboard/dashboard.component';
import {PagingConfig} from '../../../../shared/components/paginator/paging-config';
import {BehaviorSubject, Observable} from 'rxjs';
import {ParcelsSortFilterConfig} from '../../components/parcel-filter-form/parcels-sort-filter-config';
import {ParcelDataSourceService} from './parcel-data-source.service';
import {ParcelFilterFormComponent} from '../../components/parcel-filter-form/parcel-filter-form.component';
import {ParcelItemComponent} from '../../components/parcel-item/parcel-item.component';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {PaginatorComponent} from '../../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.scss'],
  animations: [trigger('transition', enterLeaveTransition)],
  imports: [
    ParcelFilterFormComponent,
    ParcelItemComponent,
    NgForOf,
    AsyncPipe,
    NgIf,
    PaginatorComponent
  ],
  standalone: true
})
export class ParcelsComponent implements OnInit {

  parcels$ = new BehaviorSubject(new Array<Parcel>());
  parcelsFetched = false;

  pagingConfig$ = new BehaviorSubject(new PagingConfig());
  sortAndFilterConfig$: BehaviorSubject<ParcelsSortFilterConfig | null> = new BehaviorSubject<ParcelsSortFilterConfig | null>(null);

  curPageParcels$: Observable<Parcel[]>;

  constructor(private parcelService: ParcelService, public dashboardLoadingService: DashboardLoadingService,
              private scrollDispatcher: ScrollDispatcher, public parcelDataSourceService: ParcelDataSourceService) {

    this.curPageParcels$ = parcelDataSourceService.connect(
      this.parcels$,
      this.pagingConfig$,
      this.sortAndFilterConfig$,
      dashboardLoadingService.loading$
    );

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

  onParcelDeleted(parcel: Parcel) {
    this.parcels$.next(this.parcels$.getValue().filter(item => item.id !== parcel.id));
  }

  scrollTop() {
    this.scrollDispatcher.scrollContainers.forEach((value, key) => {
      if (key.getElementRef().nativeElement.id == DASHBOARD_CONTENT_WRAPPER_ID) {
        key.scrollTo({top: 0, behavior: 'auto'});
      }
    });
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
