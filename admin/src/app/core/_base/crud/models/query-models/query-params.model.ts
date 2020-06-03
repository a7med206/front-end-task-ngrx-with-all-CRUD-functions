
export class QueryParamsModel {
	// fields
	filter: any;
	sortOrder: string; // asc || desc
	sortField: string;
	offset: number;
	limit: number;

	// constructor overrides
	constructor(_filter: any,
		           _sortOrder: string = 'asc',
		           _sortField: string = '',
		           _pageNumber: number = 0,
		           _pageSize: number = 10) {
		this.filter = _filter;
		this.sortOrder = _sortOrder;
		//this.sortField = _sortField;
		this.offset = _pageNumber *_pageSize;
		this.limit = _pageSize;
	}
}
