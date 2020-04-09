import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {FormBuilder} from '@angular/forms';
import {
  ParcelOrderDirectionEnum,
  ParcelOrderOptionsEnum,
  ParcelSearchOptionsEnum,
  ParcelsSortFilterConfig,
} from '../../pages/parcels/parcels-sort-filter-config';

@Component({
  selector: 'app-parcel-filter-form',
  templateUrl: './parcel-filter-form.component.html',
  styleUrls: ['./parcel-filter-form.component.css']
})
export class ParcelFilterFormComponent implements OnInit {

  @Output() sortFilterConfigEmitter = new EventEmitter<ParcelsSortFilterConfig>();

  statusOptions = ParcelStatusEnum;
  searchByOptions = ParcelSearchOptionsEnum;
  orderByOptions = ParcelOrderOptionsEnum;
  orderDirection = ParcelOrderDirectionEnum;

  filterFormKeys = {
    search: 'search',
    statusGroupName: 'status',
    statusGroup: {
      ordered: 'ordered',
      sent: 'sent',
      delivered: 'delivered'
    },
    searchBy: 'searchBy',
    orderBy: 'orderBy',
    orderDirection: 'orderDirection'
  };

  filterForm = this.fb.group({
    [this.filterFormKeys.search]: [''],
    [this.filterFormKeys.statusGroupName]: this.fb.group({
      [this.filterFormKeys.statusGroup.ordered]: [true],
      [this.filterFormKeys.statusGroup.sent]: [true],
      [this.filterFormKeys.statusGroup.delivered]: [true],
    }),
    [this.filterFormKeys.searchBy]: [this.searchByOptions.TITLE],
    [this.filterFormKeys.orderBy]: [this.orderByOptions.LAST_UPDATED],
    [this.filterFormKeys.orderDirection]: [this.orderDirection.DESCENDING]
  });

  constructor(private fb: FormBuilder) {
    this.filterForm.valueChanges.subscribe(filters => {
      let keys = this.filterFormKeys;
      let parcelStatusFilters = this.getStatusFilters(filters[keys.statusGroupName]);

      this.sortFilterConfigEmitter.emit(
        new class implements ParcelsSortFilterConfig {
          searchQuery: string = filters[keys.search];
          searchBy: ParcelSearchOptionsEnum = filters[keys.searchBy];
          orderBy: ParcelOrderOptionsEnum = filters[keys.orderBy];
          orderDirection: ParcelOrderDirectionEnum = filters[keys.orderDirection];
          statusFilters: ParcelStatusEnum[] = parcelStatusFilters;
        }
      );
    });
  }

  getStatusFilters(statusFilters) {
    const parcelStatusFilterArr = new Array<ParcelStatusEnum>();
    if (!statusFilters[this.filterFormKeys.statusGroup.ordered]) {
      parcelStatusFilterArr.push(ParcelStatusEnum.ORDERED);
    }
    if (!statusFilters[this.filterFormKeys.statusGroup.delivered]) {
      parcelStatusFilterArr.push(ParcelStatusEnum.DELIVERED);
    }
    if (!statusFilters[this.filterFormKeys.statusGroup.sent]) {
      parcelStatusFilterArr.push(ParcelStatusEnum.SENT);
    }

    return parcelStatusFilterArr;
  }

  ngOnInit(): void {
    this.filterForm.updateValueAndValidity();
  }

}
