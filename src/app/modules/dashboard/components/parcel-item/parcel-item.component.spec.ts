import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ParcelItemComponent} from './parcel-item.component';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {ParcelService} from '../../../../shared/services/parcel/parcel.service';
import {DashboardLoadingService} from '../../pages/dashboard/dashboard-loading.service';
import {Router} from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {Clipboard, ClipboardModule} from '@angular/cdk/clipboard';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {of, Subject} from 'rxjs';
import {DeleteDialogComponent} from '../../../../shared/components/dialogs/delete-dialog/delete-dialog.component';
import {EDIT_PARCEL} from '../../../../shared/constants/endpoints';
import * as urlHelper from '../../../../shared/helpers/url.helper';

describe('ParcelItemComponent', () => {

  let parcelItem: Parcel;

  let parcelServiceSpy: jasmine.SpyObj<ParcelService>;
  let dashboardLoadingServiceSpy: jasmine.SpyObj<DashboardLoadingService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let clipboardSpy: jasmine.SpyObj<Clipboard>;

  let component: ParcelItemComponent;
  let fixture: ComponentFixture<ParcelItemComponent>;

  beforeEach(() => {
    // Initialize parcel item
    parcelItem = {
      additionalInformation: 'Extra info',
      courier: 'UPS',
      id: 1,
      lastUpdated: new Date(),
      parcelStatus: {
        id: 0,
        status: ParcelStatusEnum.SENT
      },
      sender: 'Amazon',
      title: 'Stuff',
      trackingUrl: 'amazon.com/tracker/10'
    };

    // Initialize spies
    parcelServiceSpy = jasmine.createSpyObj('ParcelService', ['deleteParcel']);
    dashboardLoadingServiceSpy = jasmine.createSpyObj('DashboardLoadingService', [], [{loading$: new Subject()}]);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    clipboardSpy = jasmine.createSpyObj('Clipboard', ['copy']);

  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatSnackBarModule, ClipboardModule],
      declarations: [ParcelItemComponent],
      providers: [
        {provide: ParcelService, useValue: parcelServiceSpy},
        {provide: DashboardLoadingService, useValue: dashboardLoadingServiceSpy},
        {provide: MatDialog, useValue: matDialogSpy},
        {provide: Router, useValue: routerSpy},
        {provide: MatSnackBar, useValue: snackBarSpy},
        {provide: Clipboard, useValue: clipboardSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelItemComponent);
    component = fixture.componentInstance;
    component.parcel = parcelItem;
    fixture.detectChanges();
  });

  it('should open delete dialog on delete parcel click', () => {
    // Given
    const deleteDialogRefSpy = jasmine.createSpyObj<MatDialogRef<DeleteDialogComponent>>(['afterClosed']);
    matDialogSpy.open.and.returnValue(deleteDialogRefSpy);
    deleteDialogRefSpy.afterClosed.and.returnValue(of(true));

    spyOn(component, 'deleteParcel');

    // When
    component.onParcelDeleteClick();

    // Then
    expect(component.deleteParcel).toHaveBeenCalledTimes(1);
  });

  it('should not delete parcel when user cancels delete dialog', () => {
    // Given
    const deleteDialogRefSpy = jasmine.createSpyObj<MatDialogRef<DeleteDialogComponent>>(['afterClosed']);
    matDialogSpy.open.and.returnValue(deleteDialogRefSpy);
    deleteDialogRefSpy.afterClosed.and.returnValue(of(false));

    spyOn(component, 'deleteParcel');

    // When
    component.onParcelDeleteClick();

    // Then
    expect(component.deleteParcel).toHaveBeenCalledTimes(0);
  });

  it('should delete parcel', () => {
    // Given
    parcelServiceSpy.deleteParcel.and.returnValue(of({}));
    spyOn(component.parcelDeleted, 'emit');

    // When
    component.deleteParcel();

    // Then
    expect(component.parcelDeleted.emit).toHaveBeenCalledTimes(1);
    expect(component.parcelDeleted.emit).toHaveBeenCalledWith(parcelItem);
  });

  it('should navigate to edit parcel url', () => {
    // Given
    const parcelId = parcelItem.id;

    // When
    component.onEditParcelClick();

    // Then
    expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(EDIT_PARCEL(parcelId));
  });

  it('should copy tracking url and display snack bar success message', () => {
    // Given
    clipboardSpy.copy.and.returnValue(true);
    const trackingUrl = parcelItem.trackingUrl;

    // When
    component.onShareParcelClick();

    // Then
    expect(clipboardSpy.copy).toHaveBeenCalledTimes(1);
    expect(clipboardSpy.copy).toHaveBeenCalledWith(trackingUrl);
    expect(snackBarSpy.open).toHaveBeenCalledTimes(1);
    expect(snackBarSpy.open).toHaveBeenCalledWith(component.copiedSuccessMsg, jasmine.anything(), jasmine.anything());
  });

  it('should copy tracking url and display snack bar error message', () => {
    // Given
    clipboardSpy.copy.and.returnValue(false);
    const trackingUrl = parcelItem.trackingUrl;

    // When
    component.onShareParcelClick();

    // Then
    expect(clipboardSpy.copy).toHaveBeenCalledTimes(1);
    expect(clipboardSpy.copy).toHaveBeenCalledWith(trackingUrl);
    expect(snackBarSpy.open).toHaveBeenCalledTimes(1);
    expect(snackBarSpy.open).toHaveBeenCalledWith(component.copiedErrorMsg, jasmine.anything(), jasmine.anything());
  });

  it('should copy tracking url and display snack bar missing url message', () => {
    // Given
    clipboardSpy.copy.and.returnValue(false);
    parcelItem.trackingUrl = undefined;

    // When
    component.onShareParcelClick();

    // Then
    expect(clipboardSpy.copy).toHaveBeenCalledTimes(0);
    expect(snackBarSpy.open).toHaveBeenCalledTimes(1);
    expect(snackBarSpy.open).toHaveBeenCalledWith(component.copiedMissingUrlMsg, jasmine.anything(), jasmine.anything());
  });

  it('should open new tab with tracking url', () => {
    // Given
    let prefixedUrl = 'http://' + parcelItem.trackingUrl;
    spyOn(window, 'open');
    spyOn(urlHelper, 'prefixUrl').and.returnValue(prefixedUrl);

    // When
    component.goToTrackingUrl();

    // Then
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(prefixedUrl, '_blank');
  });

  it('should not open new tab without tracking url present', () => {
    // Given
    parcelItem.trackingUrl = undefined;
    spyOn(window, 'open');

    // When
    component.goToTrackingUrl();

    // Then
    expect(window.open).toHaveBeenCalledTimes(0);
  });

});
