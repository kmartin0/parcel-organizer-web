import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ChangeDetectorRef, Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output} from '@angular/core';
import {EditParcelComponent} from './edit-parcel.component';
import {DashboardLoadingService} from '../dashboard/dashboard-loading.service';
import {ParcelService} from '../../../../shared/services/parcel/parcel.service';
import {ActivatedRoute, convertToParamMap} from '@angular/router';

import {UntypedFormControl, ValidatorFn} from '@angular/forms';
import {Parcel} from '../../../../shared/models/parcel';
import {ParcelStatusEnum} from '../../../../shared/models/parcel-status-enum';
import {of, Subject, throwError} from 'rxjs';
import {ApiErrorBody} from '../../../../shared/models/api-error-body';
import {ApiErrorEnum} from '../../../../api/api-error.enum';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ParcelFormComponent} from '../../components/parcel-form/parcel-form.component';
import {FormComponent} from '../../../../shared/components/dynamic-form/form/form.component';
import {BaseInputField} from '../../../../shared/components/dynamic-form/base-input-field';

@Component({
  selector: 'app-form',
  template: '',
  providers: [{provide: FormComponent, useClass: FormComponentStub}],
  standalone: true
})
export class FormComponentStub {

  @Input() confirmButtonWidth = '50%';
  @Input() loading$?: Subject<boolean>;
  @Input() formName = 'Submit';
  @Input() inputFields!: BaseInputField[];
  @Input() formValidators!: ValidatorFn[];
  @Output() formValidSubmit: EventEmitter<{ [key: string]: string; }> = new EventEmitter();

  getFormControl(key: string): UntypedFormControl {
    return new UntypedFormControl();
  }

  resetForm(value?: any) {
  }

  setError(formControlKey: string, error: string) {
  };

}

@Component({
  selector: 'app-parcel-form',
  template: '',
  providers: [{provide: ParcelFormComponent, useClass: ParcelFormComponentStub}],
  standalone: true
})
export class ParcelFormComponentStub {
  // _formComponent = TestBed.createComponent(FormComponentStub).componentInstance as FormComponent;
  _formComponent = new FormComponentStub() as FormComponent;
  public get formComponent(): FormComponent {
    return this._formComponent;
  }

  @Input() loading$?: Subject<boolean> = new Subject<boolean>();

  displaySuccess(callback?: () => void) {
    if (callback) callback();
  }

  resetForm(value?: any) {
  }

  handleApiError(apiError: any) {
  }
}

describe('EditParcelComponent', () => {

  let parcelServiceSpy: jasmine.SpyObj<ParcelService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let dashboardLoadingServiceSpy: jasmine.SpyObj<DashboardLoadingService>;
  let changeDetectorRefSpy: jasmine.SpyObj<ChangeDetectorRef>;
  let formControlSpy: jasmine.SpyObj<UntypedFormControl>;

  let component: EditParcelComponent;
  let fixture: ComponentFixture<EditParcelComponent>;


  // const parcelToEdit: Parcel = {
  //   additionalInformation: 'Trousers',
  //   courier: 'ups',
  //   id: 23,
  //   lastUpdated: new Date(),
  //   parcelStatus: {
  //     id: 0,
  //     status: ParcelStatusEnum.ORDERED
  //   },
  //   sender: 'Amazon',
  //   title: 'Clothes',
  //   trackingUrl: 'ups.com/track/123'
  // };

  function createParcelToEdit(): Parcel {
    return {
      additionalInformation: 'Trousers',
      courier: 'ups',
      id: 25,
      lastUpdated: new Date(),
      parcelStatus: {
        id: 0,
        status: ParcelStatusEnum.ORDERED
      },
      sender: 'Amazon',
      title: 'Clothes',
      trackingUrl: 'ups.com/track/123' // Unique tracking URL
    };
  }

  beforeEach(() => {
    const initialParcelToEdit = createParcelToEdit();

    // Initialize spies
    parcelServiceSpy = jasmine.createSpyObj('ParcelService', ['editParcel', 'getParcel']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {paramMap: of(convertToParamMap({id: initialParcelToEdit.id}))});
    dashboardLoadingServiceSpy = jasmine.createSpyObj('DashboardLoadingService', [], [{loading$: new Subject()}]);
    changeDetectorRefSpy = {} as jasmine.SpyObj<ChangeDetectorRef>;
    formControlSpy = jasmine.createSpyObj('FormControl', ['setValue']);

    // Setup spy return values necessary for constructing the component.
    parcelServiceSpy.getParcel.withArgs(initialParcelToEdit.id!!).and.returnValue(of(initialParcelToEdit));
  });

  beforeEach(waitForAsync(() => {
    // Configure testing module
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, EditParcelComponent],
      declarations: [],
      providers: [
        {provide: ParcelService, useValue: parcelServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteSpy},
        {provide: DashboardLoadingService, useValue: dashboardLoadingServiceSpy},
        {provide: ChangeDetectorRef, useValue: changeDetectorRefSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(EditParcelComponent, {
        remove: {imports: [ParcelFormComponent]},
        add: {imports: [ParcelFormComponentStub]},
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditParcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set access to denied when forbidden access', () => {
    // Given
    const accessDenied: ApiErrorBody = {
      code: 403,
      error: ApiErrorEnum.access_denied,
      error_description: 'User doesn\'t have access to this parcel.'
    };

    const parcelToEdit = createParcelToEdit();
    parcelServiceSpy.getParcel.withArgs(parcelToEdit.id!!).and.returnValue(throwError(accessDenied));

    // When
    component.ngAfterViewInit();

    // Then
    expect(component.hasAccess).toBeFalse();
  });


  it('should set access to denied when parcel not found', () => {
    // Given
    const resourceNotFound: ApiErrorBody = {
      code: 404,
      error: ApiErrorEnum.RESOURCE_NOT_FOUND,
      error_description: 'Parcel cannot be found.'
    };

    const editedParcel = createParcelToEdit();
    parcelServiceSpy.getParcel.withArgs(editedParcel.id!!).and.returnValue(throwError(resourceNotFound));

    // When
    component.ngAfterViewInit();

    // Then
    expect(component.hasAccess).toBeFalse();
  });

  it('should display success message and go back to previous page after edit parcel', () => {
    // Given
    const editedParcel = createParcelToEdit()
    editedParcel.title = 'Different Clothes';

    const returnParcel = createParcelToEdit()
    returnParcel.title = 'Different Clothes';

    parcelServiceSpy.editParcel.and.returnValue(of(returnParcel));
    spyOn(component.parcelFormComponent, 'displaySuccess').and.callThrough();

    // When
    component.onParcelResult(editedParcel);

    // Then
    expect(parcelServiceSpy.editParcel).toHaveBeenCalledTimes(1);
    expect(parcelServiceSpy.editParcel).toHaveBeenCalledWith(editedParcel);

    expect(component.parcelFormComponent.displaySuccess).toHaveBeenCalledTimes(1);
  });

  it('should let parcel form component handle api error', () => {
    // Given
    const invalidArguments: ApiErrorBody = {
      code: 400,
      error: ApiErrorEnum.INVALID_ARGUMENTS,
      error_description: 'Arguments were invalid.'
    };

    const parcelToEdit = createParcelToEdit();

    parcelServiceSpy.editParcel.and.returnValue(throwError(invalidArguments));
    spyOn(component.parcelFormComponent, 'handleApiError');

    // When
    component.onParcelResult(parcelToEdit);

    // Then
    expect(component.parcelFormComponent.handleApiError).toHaveBeenCalledTimes(1);
    expect(component.parcelFormComponent.handleApiError).toHaveBeenCalledWith(invalidArguments);
  });

});

