import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SuccessComponent} from './success.component';

describe('SuccessComponent', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set isDisplaying to true', () => {
    // Given
    component.isDisplaying = false;

    // When
    component.play();

    // Then
    expect(component.isDisplaying).toEqual(true);
  });
});
