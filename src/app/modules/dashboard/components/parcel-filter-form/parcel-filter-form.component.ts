import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
  ParcelOrderDirectionEnum,
  ParcelOrderOptionsEnum,
  ParcelSearchOptionsEnum,
  ParcelsSortFilterConfig,
} from './parcels-sort-filter-config';
import {trigger} from '@angular/animations';
import {ParcelFilterFormCacheService} from '../../pages/parcels/parcel-filter-form-cache.service';
import {expandCollapseTransition} from '../../../../shared/anim/expand-collapse.anim';

@Component({
  selector: 'app-parcel-filter-form',
  templateUrl: './parcel-filter-form.component.html',
  styleUrls: ['./parcel-filter-form.component.scss'],
  animations: [trigger('expandCollapseAnimation', expandCollapseTransition)]
})
export class ParcelFilterFormComponent implements OnInit {

  @Output() sortFilterConfigEmitter = new EventEmitter<ParcelsSortFilterConfig>();

  searchInput = '';

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

  constructor(private fb: FormBuilder, private parcelFilterFormCacheService: ParcelFilterFormCacheService) {
    this.initValueChangesObserver();
    this.initParcelFiltersFromCache();
  }

  ngOnInit(): void {
    this.filterForm.updateValueAndValidity();
  }

  showBottomSection = false;

  toggleBottomSection() {
    this.showBottomSection = !this.showBottomSection;
  }

  private initValueChangesObserver() {
    this.filterForm.valueChanges.subscribe(filters => {
      let keys = this.filterFormKeys;
      let parcelStatusFilters = this.getStatusFilters(filters[keys.statusGroupName]);

      let parcelFilterConfig: ParcelsSortFilterConfig = {
        searchQuery: filters[keys.search],
        searchBy: filters[keys.searchBy],
        orderBy: filters[keys.orderBy],
        orderDirection: filters[keys.orderDirection],
        statusFilters: parcelStatusFilters
      };

      this.searchInput = parcelFilterConfig.searchQuery;
      this.parcelFilterFormCacheService.persistParcelFilters(parcelFilterConfig);
      this.sortFilterConfigEmitter.emit(parcelFilterConfig);
    });
  }

  initParcelFiltersFromCache() {
    const cachedConfig = this.parcelFilterFormCacheService.getCachedParcelFilters();

    if (cachedConfig) {
      this.filterForm.controls[this.filterFormKeys.search].setValue(cachedConfig.searchQuery);
      this.filterForm.controls[this.filterFormKeys.searchBy].setValue(cachedConfig.searchBy);
      this.filterForm.controls[this.filterFormKeys.orderBy].setValue(cachedConfig.orderBy);
      this.filterForm.controls[this.filterFormKeys.orderDirection].setValue(cachedConfig.orderDirection);

      let statusGroup = this.filterForm.controls[this.filterFormKeys.statusGroupName] as FormGroup;
      cachedConfig.statusFilters.forEach(statusFilter => {
        switch (statusFilter) {
          case ParcelStatusEnum.SENT:
            statusGroup.controls[this.filterFormKeys.statusGroup.sent].setValue(false);
            break;
          case ParcelStatusEnum.ORDERED:
            statusGroup.controls[this.filterFormKeys.statusGroup.ordered].setValue(false);
            break;
          case ParcelStatusEnum.DELIVERED:
            statusGroup.controls[this.filterFormKeys.statusGroup.delivered].setValue(false);
            break;
        }
      });
    }
  }

  private getStatusFilters(statusFilters): Array<ParcelStatusEnum> {
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

}
