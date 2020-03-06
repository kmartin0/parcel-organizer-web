import {Component, OnInit} from '@angular/core';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelStatus} from '../../../../shared/models/parcel-status';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.css']
})
export class ParcelsComponent implements OnInit {

  parcels = new Array<Parcel>();

  constructor() {
    const ordered: ParcelStatus = new class implements ParcelStatus {
      id = 0;
      status = ParcelStatusEnum.ORDERED;
    };

    const sent: ParcelStatus = new class implements ParcelStatus {
      id = 1;
      status = ParcelStatusEnum.SENT;
    };

    const delivered: ParcelStatus = new class implements ParcelStatus {
      id = 2;
      status = ParcelStatusEnum.DELIVERED;
    };

    this.parcels.push(
      new class implements Parcel {
        courier = 'PostNL';
        id = 0;
        lastUpdated = new Date();
        parcelStatus = ordered;
        sender = 'Bol.com Bol.com  Bol.';
        title = 'Shoes';
        trackingUrl: string;
      },
      new class implements Parcel {
        courier = 'PostNL';
        id = 1;
        lastUpdated = new Date();
        parcelStatus = sent;
        sender = 'Coolblue';
        title = 'Electronics';
        trackingUrl: string;
      },
      new class implements Parcel {
        courier = 'DHL';
        id = 2;
        lastUpdated = new Date();
        parcelStatus = delivered;
        sender = 'Nike';
        title = 'Sportswear';
        trackingUrl: string;
      }
    );
  }

  ngOnInit() {
  }

}
