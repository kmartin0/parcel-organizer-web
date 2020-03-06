import {Component, Input, OnInit} from '@angular/core';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {
  faShoppingBag,
  faTruck,
  faClock,
  faShareAlt,
  faTrash,
  faBoxOpen,
  faShippingFast,
  faMoneyCheckAlt,
  faPen
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-parcel-item',
  templateUrl: './parcel-item.component.html',
  styleUrls: ['./parcel-item.component.css']
})
export class ParcelItemComponent implements OnInit {

  @Input() parcel: Parcel;

  parcelStatuses = ParcelStatusEnum;

  faIcons = {
    sender: faShoppingBag,
    courier: faTruck,
    date: faClock,
    share: faShareAlt,
    edit: faPen,
    delete: faTrash,
    sent: faShippingFast,
    ordered: faMoneyCheckAlt,
    delivered: faBoxOpen,
  };

  faIconStyle = {
    width: '20px',
    height: '20px'
  };

  constructor() {
  }

  ngOnInit() {
  }

}
