import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {
  ParcelOrderDirectionEnum,
  ParcelOrderOptionsEnum,
  ParcelSearchOptionsEnum,
  ParcelsSortFilterConfig,
} from './parcels-sort-filter-config';
import {trigger} from '@angular/animations';
import {ParcelFilterFormCacheService} from '../../pages/parcels/parcel-filter-form-cache.service';
import {expandCollapseTransition} from '../../../../shared/anim/expand-collapse.anim';
import {MatIcon} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgClass, NgIf} from '@angular/common';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatInput} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-parcel-filter-form',
  templateUrl: './parcel-filter-form.component.html',
  styleUrls: ['./parcel-filter-form.component.scss'],
  animations: [trigger('expandCollapseAnimation', expandCollapseTransition)],
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatFormFieldModule,
    NgIf,
    NgClass,
    MatCheckbox,
    MatRadioGroup,
    MatRadioButton,
    MatInput,
    MatIconButton
  ],
  standalone: true
})
export class ParcelFilterFormComponent implements OnInit {

  constructor(private fb: UntypedFormBuilder, private parcelFilterFormCacheService: ParcelFilterFormCacheService) {
    this.initValueChangesObserver();
    this.initParcelFiltersFromCache();
  }

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

  showBottomSection = false;

  ngOnInit(): void {
    this.filterForm.updateValueAndValidity();
  }

  toggleBottomSection() {
    this.showBottomSection = !this.showBottomSection;
  }

  private initValueChangesObserver() {
    this.filterForm.valueChanges.subscribe(filters => {
      const keys = this.filterFormKeys;
      const parcelStatusFilters = this.getStatusFilters(filters[keys.statusGroupName]);

      const parcelFilterConfig: ParcelsSortFilterConfig = {
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

      const statusGroup = this.filterForm.controls[this.filterFormKeys.statusGroupName] as UntypedFormGroup;
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

  private getStatusFilters(statusFilters: any): Array<ParcelStatusEnum> {
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
