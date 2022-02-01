import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {DeleteDialogComponent} from './delete-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

describe('DeleteDialogComponent', () => {

  const deleteData = 'Clothes';

  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [DeleteDialogComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {toDelete: deleteData}},
        {provide: MatDialogRef, useValue: {}},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component.toDelete).toEqual(deleteData);
    expect(component).toBeTruthy();
  });
});
