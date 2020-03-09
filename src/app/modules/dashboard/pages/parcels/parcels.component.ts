import {Component, OnInit} from '@angular/core';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../../../shared/anim/enter-leave.anim';
import {DashboardLoadingService} from '../../components/dashboard-loading.service';
import {loadingIndicator} from '../../../../shared/helpers/operators';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.css'],
  animations: [trigger('items', enterLeaveTransition)]
})
export class ParcelsComponent implements OnInit {

  parcels = new Array<Parcel>();

  constructor(private parcelService: ParcelService, private dashboardLoadingService: DashboardLoadingService) {
    this.getParcels();
  }

  private getParcels() {
    this.parcelService.getParcels().pipe(
      loadingIndicator(this.dashboardLoadingService.loading$)
    ).subscribe(value => {
      this.parcels.splice(0, this.parcels.length);
      this.parcels.push(...value);
    }, error => {});
  }

  onParcelDeleted(parcel: Parcel) {
    this.parcels = this.parcels.filter(item => item.id !== parcel.id);
  }

  ngOnInit() {
  }

}
