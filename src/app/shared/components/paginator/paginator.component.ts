import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  faIcons = {
    left: faChevronLeft,
    right: faChevronRight
  };

  @Output() curPageEvent = new EventEmitter<number>();
  @Input() lastPage = 1;
  @Input() curPage = 1;

  private _firstPage = 1;

  get firstPage(): number {
    return this._firstPage;
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  getPages(): number[] {
    return Array.from(Array(this.lastPage).keys()).map(value => value+1);
  }

  onPreviousPage() {
    if (this.curPage > this.firstPage) {
      this.setPageAndEmit(this.curPage - 1);
    }
  }

  onNextPage() {
    if (this.curPage < this.lastPage) {
      this.setPageAndEmit(this.curPage + 1);
    }
  }

  onPage(page: number) {
    if (page < this.firstPage || page > this.lastPage) {
      throw new Error('Page number cannot exceed first or last page.');
    }
    this.setPageAndEmit(page);
  }

  setPageAndEmit(newPage: number) {
    this.curPage = newPage;
    this.curPageEvent.emit(this.curPage);
  }

}
