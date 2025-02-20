import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PaginatorComponent} from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PaginatorComponent],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.lastPage = 5;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should return array of the page numbers', () => {
    // Given
    const expected = [1, 2, 3, 4, 5];

    // Then
    expect(component.getPages()).toEqual(expected);
  });

  it('should set page and emit to previous page', () => {
    // Given
    spyOn(component, 'setPageAndEmit');
    component.curPage = 2;

    // When
    component.onPreviousPage();

    // Then
    expect(component.setPageAndEmit).toHaveBeenCalledTimes(1);
    expect(component.setPageAndEmit).toHaveBeenCalledWith(1);
  });

  it('should not set page and emit to previous page when on the first page', () => {
    // Given
    spyOn(component, 'setPageAndEmit');
    component.curPage = 1;

    // When
    component.onPreviousPage();

    // Then
    expect(component.setPageAndEmit).toHaveBeenCalledTimes(0);
  });

  it('should set page and emit to next page', () => {
    // Given
    spyOn(component, 'setPageAndEmit');
    component.curPage = 2;

    // When
    component.onNextPage();

    // Then
    expect(component.setPageAndEmit).toHaveBeenCalledTimes(1);
    expect(component.setPageAndEmit).toHaveBeenCalledWith(3);
  });

  it('should not set page and emit to next page when on the last page', () => {
    // Given
    spyOn(component, 'setPageAndEmit');
    component.curPage = 5;

    // When
    component.onNextPage();

    // Then
    expect(component.setPageAndEmit).toHaveBeenCalledTimes(0);
  });

  it('should set page to 4', () => {
    // Given
    spyOn(component, 'setPageAndEmit');

    // When
    component.onPage(4);

    // Then
    expect(component.setPageAndEmit).toHaveBeenCalledTimes(1);
    expect(component.setPageAndEmit).toHaveBeenCalledWith(4);
  });

  it('should throw error if page is set out of upper bounds', () => {
    // Given
    spyOn(component, 'setPageAndEmit');

    // Then
    expect(() => {
      component.onPage(component.lastPage + 5);
    }).toThrow();
  });

  it('should throw error if page is set out of lower bounds', () => {
    // Given
    spyOn(component, 'setPageAndEmit');

    // Then
    expect(() => {
      component.onPage(component.firstPage - 1);
    }).toThrow();
  });

  it('should update cur page and emit cur page with new page', () => {
    // Given
    spyOn(component.curPageEvent, 'emit');

    // When
    component.setPageAndEmit(3);

    // Then
    expect(component.curPageEvent.emit).toHaveBeenCalledTimes(1);
    expect(component.curPageEvent.emit).toHaveBeenCalledWith(3);
    expect(component.curPage).toEqual(3);
  });
});
