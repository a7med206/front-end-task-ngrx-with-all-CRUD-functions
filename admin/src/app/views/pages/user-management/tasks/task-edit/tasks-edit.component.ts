// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Services and Models
import {
	Task,
	TaskUpdated,
	// selectTaskById,
	TaskOnServerCreated,
	lastCreatedTasksId,
	selectTasksActionLoading
} from '../../../../../core/auth';
import {TaskService} from '../../../../../core/auth/_services/task.service'
@Component({
	selector: 'kt-Task-edit',
	templateUrl: './tasks-edit.component.html',
})
export class TaskEditComponent implements OnInit, OnDestroy {
	// Public properties
	Task: any;
	TaskId$: Observable<number>;
	oldTask: Task;
	selectedTab = 0;
	loading$: Observable<boolean>;
	TaskForm: FormGroup;
	hasFormErrors = false;
	active:boolean = false
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param TaskFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private activatedRoute: ActivatedRoute,
		           private router: Router,
		           private TaskFB: FormBuilder,
		           private subheaderService: SubheaderService,
		           private layoutUtilsService: LayoutUtilsService,
		           private store: Store<AppState>,
				   private layoutConfigService: LayoutConfigService,
				   private TaskService : TaskService) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectTasksActionLoading));

		this.TaskForm = new FormGroup({
			TaskName: new FormControl(),
			apiType: new FormControl(),
			userFullName: new FormControl(),
			userEmail: new FormControl(),
			description: new FormControl(),
			time: new FormControl(),
			date: new FormControl(),
			active: new FormControl()
		 });
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			// console.log(id);
			if (id) {
				this.TaskService.findTask(id).subscribe(res => {
					if (res) {
						this.Task = res;
						// console.log(this.Task);
						// this.apiTypesSubject.next(this.Task.apiType);
						this.oldTask = Object.assign({}, this.Task);
						this.initTask();
					}
				});
			} else {
				this.Task = new Task();
				this.Task.clear();
				// this.apiTypesSubject.next(this.Task.apiType);
				// this.addressSubject.next(this.Task.address);
				// this.soicialNetworksSubject.next(this.Task.socialNetworks);
				this.oldTask = Object.assign({}, this.Task);
				this.initTask();
			}
		});
		this.subscriptions.push(routeSubscription);

	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Init Task
	 */
	initTask() {
		this.createForm();
		if (!this.Task.id) {
			this.subheaderService.setTitle('Create Task');
			this.subheaderService.setBreadcrumbs([
				{ title: 'User Management', page: `User-management` },
				{ title: 'Tasks',  page: `User-management/tasks` },
				{ title: 'Create Task', page: `User-management/tasks/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit Task');
		this.subheaderService.setBreadcrumbs([
			{ title: 'User Management', page: `User-management` },
			{ title: 'Tasks',  page: `User-management/tasks` },
			{ title: 'Edit Task', page: `User-management/tasks/edit`, queryParams: { id: this.Task.id } }
		]);
	}

	/**
	 * Create form
	 */
	createForm() {
		this.TaskForm = this.TaskFB.group({
            TaskName: [this.Task.TaskName, Validators.required],
            apiType: [this.Task.apiType, Validators.required],
			userFullName: [this.Task.userFullName, Validators.required],
			userEmail: [this.Task.userEmail, [ Validators.email, Validators.required] ],
			date: [this.Task.date, Validators.required],
			time: [this.Task.time, Validators.required],
			description: [this.Task.description],
			active: [this.Task.active]
		});
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/user-management/tasks`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh Task
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshTask(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/user-management/tasks/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.Task = Object.assign({}, this.oldTask);
		this.createForm();
		this.hasFormErrors = false;
		this.TaskForm.markAsPristine();
  this.TaskForm.markAsUntouched();
  this.TaskForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.TaskForm.controls;
		/** check form */
		if (this.TaskForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedTask = this.prepareTask();

		if (!!editedTask.id) {
			this.updateTask(editedTask, withBack = true);
			return;
		}

		this.addTask(editedTask, withBack = true);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareTask(): Task {
		const controls = this.TaskForm.controls;
		const _Task = new Task();
		_Task.clear();
		_Task.apiType = controls.apiType.value;
		_Task.id = this.Task.id;
		_Task.TaskName = controls.TaskName.value;
		_Task.userEmail = controls.userEmail.value;
		_Task.userFullName = controls.userFullName.value;
		_Task.description = controls.description.value;
		_Task.time = controls.time.value;
		_Task.date = controls.date.value;
		_Task.active = controls.active.value;
		return _Task;
	}

	/**
	 * Add Task
	 *
	 * @param _Task: Task
	 * @param withBack: boolean
	 */
	addTask(_Task: Task, withBack) {
		this.store.dispatch(new TaskOnServerCreated({ Task: _Task }));
		const addSubscription = this.store.pipe(select(lastCreatedTasksId)).subscribe(newId => {
			const message = `New Task successfully has been added.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			if (newId) {
				if (!!withBack) {
					this.goBackWithId();
				} else {
					this.refreshTask(true, newId);
				}
			}
		});
		this.subscriptions.push(addSubscription);
	}

	/**
	 * Update Task
	 *
	 * @param _Task: Task
	 * @param withBack: boolean
	 */
	updateTask(_Task: Task, withBack) {
		// Update Task
		// tslint:disable-next-line:prefer-const

		const updatedTask: Update<Task> = {
			id: _Task.id,
			changes: _Task
		};
		this.store.dispatch(new TaskUpdated( { partialTask: updatedTask, Task: _Task }));
		const message = `Task successfully has been saved.`;
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		if (!!withBack) {
			this.goBackWithId();
		} else {
			this.refreshTask(false);
		}
	}

	/**
	 * Returns component title
	 */
	getComponentTitle() {
		let result = 'Create Task';
		if (!this.Task || !this.Task.id) {
			return result;
		}

		result = `Edit Task - ${this.Task.TaskName}`;
		return result;
	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
