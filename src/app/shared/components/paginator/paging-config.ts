export class PagingConfig {
  curPage: number = 1;
  maxPages: number = 1;
  pageSize: number = 24;

  setMaxPagesBySize(numOfItems: number) {
    this.maxPages = Math.ceil(numOfItems / this.pageSize);
  }
}
