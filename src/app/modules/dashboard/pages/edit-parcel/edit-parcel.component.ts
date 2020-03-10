import {Component, OnInit} from '@angular/core';
import {ParcelService} from '../../../../shared/services/parcel.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Parcel} from '../../../../shared/models/parcel';
import {isApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';

@Component({
  selector: 'app-edit-parcel',
  templateUrl: './edit-parcel.component.html',
  styleUrls: ['./edit-parcel.component.css']
})
export class EditParcelComponent implements OnInit {

  parcel: Parcel;
  hasAccess = undefined;

  constructor(private parcelService: ParcelService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getParcel();
  }

  getParcel() {
    this.route.paramMap.pipe(
      switchMap(params => {
          return this.parcelService.getParcel(params.get('id'));
        }
      )
    ).subscribe(value => {
      this.parcel = value;
      this.hasAccess = true;
    }, error => {
      if (isApiErrorBody(error)) {
        if (error.error == ApiErrorEnum.access_denied) {
          this.hasAccess = false;
        }
      }
    });
  }
}
