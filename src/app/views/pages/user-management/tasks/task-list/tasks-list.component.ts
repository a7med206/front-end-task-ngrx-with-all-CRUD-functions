// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
// LODASH
import { each, find } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
// Models
import {
	Task,
	TasksDataSource,
	TaskDeleted,
	TasksPageRequested
} from '../../../../../core/auth';
import { SubheaderService } from '../../../../../core/_base/layout';

@Component({
	selector: 'kt-Tasks-list',
	templateUrl: './Tasks-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})export class TasksListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: TasksDataSource;
	displayedColumns = ['select', 'id', 'TaskName', 'email', 'fullname', 'description', 'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<Task>(true, []);
	TasksResult: Task[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];


	/**
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param router: Router
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param subheaderService: SubheaderService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef) {}

        
	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {

		// If the Task changes the sort order, reset back to the first page.
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadTasksList();
			})
		)
		.subscribe();
		this.subscriptions.push(paginatorSubscriptions);


		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(150), // The Task can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadTasksList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('User management');

		// Init DataSource
		this.dataSource = new TasksDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.TasksResult = res;
			// console.log(res);
		});
		this.subscriptions.push(entitiesSubscription);
		
		// First Load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadTasksList();
		});
	}

/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load Tasks list
	 */
	loadTasksList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new TasksPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const searchText: string = this.searchInput.nativeElement.value;
		const filter: any = {
			where :{
				and: [
					{isDeleted: {neq:true}},
					{ or: [{TaskName:  {like: searchText }}, 
						{userFullName: {like : searchText}},
						{userEmail: {like : searchText}}
					] }
					// 		{nameAr:  {like: searchText + '.*', options: "i"}} ] }
				]
		    },
			// include:['TaskName']
			include: []
		};
		// const searchText: string = this.searchInput.nativeElement.value;
		// filter.lastName = searchText;
		// filter.TaskName = searchText;
		// filter.email = searchText;
		// filter.fillname = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete Task
	 *
	 * @param _item: Task
	 */
	deleteTask(_item: Task) {
		const _title = 'Task Delete';
		const _description = 'Are you sure to permanently delete this Task?';
		const _waitDesciption = 'Task is deleting...';
		const _deleteMessage = `Task has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new TaskDeleted({ id: _item.id, isDeleted: _item.isDeleted }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	/**
	 * Fetch selected rows
	 */
	fetchTasks() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
                text: `${elem.TaskName}, ${elem.apiType} ${elem.description} ${elem.time} ${elem.userFullName} ${elem.userEmail}`,
				id: elem.id.toString(),
				status: elem.date
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.TasksResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.TasksResult.length) {
			this.selection.clear();
		} else {
			this.TasksResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */

	/**
	 * Redirect to edit page
	 *
	 * @param id
	 */
	editTask(id) {
		// console.log(id);
		this.router.navigate(['../tasks/edit', id], { relativeTo: this.activatedRoute });
	}
}


