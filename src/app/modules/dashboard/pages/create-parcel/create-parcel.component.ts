import {Component, OnInit, ViewChild} from '@angular/core';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {ActivatedRoute} from '@angular/router';
import {DashboardLoadingService} from '../../components/dashboard-loading.service';
import {Subject} from 'rxjs';
import {Parcel} from '../../../../shared/models/parcel';
import {loadingIndicator} from '../../../../shared/helpers/operators';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../../../shared/anim/enter-leave.anim';
import {ParcelFormComponent} from '../../components/parcel-form/parcel-form.component';

@Component({
  selector: 'app-create-parcel',
  templateUrl: './create-parcel.component.html',
  styleUrls: ['./create-parcel.component.css'],
  animations: [trigger('form', enterLeaveTransition)]
})
export class CreateParcelComponent implements OnInit {

  loading$ = new Subject<boolean>();

  @ViewChild(ParcelFormComponent, {static: false}) private _parcelFormComponent: ParcelFormComponent;
  get parcelFormComponent(): ParcelFormComponent {
    return this._parcelFormComponent;
  }

  constructor(private parcelService: ParcelService, private route: ActivatedRoute, private dashboardLoadingService: DashboardLoadingService) {
  }

  ngOnInit() {
  }

  onParcelResult(parcel: Parcel) {
    this.parcelService.createParcel(parcel).pipe(
      loadingIndicator(this.loading$),
      loadingIndicator(this.dashboardLoadingService.loading$)
    ).subscribe(value => {
      this.parcelFormComponent.displaySuccess(() => {
        this.parcelFormComponent.resetForm();
      });
    }, error => {
      this.parcelFormComponent.handleParcelApiError(error);
    });
  }

}
