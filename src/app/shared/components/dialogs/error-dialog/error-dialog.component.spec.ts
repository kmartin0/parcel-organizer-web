import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ErrorDialogComponent} from './error-dialog.component';

describe('ErrorDialogComponent', () => {

  const messageData = 'Error something bad happened.';

  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ErrorDialogComponent],
      declarations: [],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {message: messageData}},
        {provide: MatDialogRef, useValue: {}},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component.message).toEqual(messageData);
    expect(component).toBeTruthy();
  });
});
