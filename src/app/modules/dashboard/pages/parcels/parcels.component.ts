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

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.css'],
  animations: [trigger('items', enterLeaveTransition)]
})
export class ParcelsComponent implements OnInit {

  parcels = new Array<Parcel>();
  pageSize = 20;
  maxPages = 1;
  curPage = 1;
  curPageParcels = new Array<Parcel>();
  parcelsFetched = false;

  @ViewChild('parcelsContainer') divView: ElementRef;

  constructor(private parcelService: ParcelService, private dashboardLoadingService: DashboardLoadingService, private route: ActivatedRoute,
              private router: Router, private scrollDispatcher: ScrollDispatcher) {
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
            this.curPage = Number(pageParam);
            this.updatePage();
          }
        }
      });
  }

  updatePage() {
    this.maxPages = Math.ceil(this.parcels.length / this.pageSize);

    const endIndex = this.curPage == 1 ? this.pageSize : this.curPage * this.pageSize;
    const startIndex = endIndex - this.pageSize;

    this.curPageParcels = this.parcels.slice(startIndex, endIndex);
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
        key.scrollTo({top: 0, behavior: 'smooth'});
      }
    });
  }

  onParcelDeleted(parcel: Parcel) {
    this.parcels = this.parcels.filter(item => item.id !== parcel.id);
  }

  private getParcels() {
    this.parcelService.getParcels().pipe(
      withLoading(this.dashboardLoadingService.loading$)
    ).subscribe(value => {
      this.parcels.splice(0, this.parcels.length);
      this.parcels.push(...value);
      this.parcelsFetched = true;
      this.updatePage();
    }, error => {
      this.parcelsFetched = true;
    });
  }

}
