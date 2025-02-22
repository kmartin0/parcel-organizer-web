import {Component, OnInit, ViewChild} from '@angular/core';
import {ParcelService} from '../../../../shared/services/parcel/parcel.service';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {Subject} from 'rxjs';
import {Parcel} from '../../../../shared/models/parcel';
import {withLoading} from '../../../../shared/helpers/operators';
import {trigger} from '@angular/animations';
import {enterLeaveTransition} from '../../../../shared/anim/enter-leave.anim';
import {ParcelFormComponent} from '../../components/parcel-form/parcel-form.component';

@Component({
  selector: 'app-create-parcel',
  templateUrl: './create-parcel.component.html',
  styleUrls: ['./create-parcel.component.scss'],
  animations: [trigger('form', enterLeaveTransition)],
  imports: [
    ParcelFormComponent
  ],
  standalone: true
})
export class CreateParcelComponent implements OnInit {

  loading$: Subject<boolean>;

  @ViewChild(ParcelFormComponent, {static: false}) private _parcelFormComponent!: ParcelFormComponent;
  get parcelFormComponent(): ParcelFormComponent {
    return this._parcelFormComponent;
  }

  constructor(private parcelService: ParcelService, private dashboardLoadingService: DashboardLoadingService) {
    this.loading$ = dashboardLoadingService.loading$;
  }

  ngOnInit() {
  }

  onParcelResult(parcel: Parcel) {
    this.parcelService.createParcel(parcel).pipe(
      withLoading(this.loading$)
    ).subscribe(value => {
      this.parcelFormComponent.displaySuccess(() => {
        this.parcelFormComponent.resetForm();
      });
    }, error => {
      this.parcelFormComponent.handleApiError(error);
    });
  }

}
