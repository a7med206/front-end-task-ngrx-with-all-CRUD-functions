// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';
// Services
import { TaskService } from '../../../core/auth/_services/task.service';
// State
import { AppState } from '../../../core/reducers';
import { TasksActionToggleLoading,
	TasksActionTypes,
	TasksPageRequested,
	AllTasksLoaded,
	TaskDeleted,
	TaskUpdated,
	TaskOnServerCreated,
	TaskCreated,

 } from '../_actions/task.actions';

@Injectable()
export class TasksEffects {

	showActionLoadingDistpatcher = new TasksActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new TasksActionToggleLoading({ isLoading: false });

	@Effect()
	loadAllTasks$ = this.actions$
	.pipe(
		ofType<TasksPageRequested>(TasksActionTypes.TasksPageRequested),
		mergeMap(( { payload } ) => {
			const filter ={ where : payload.page.filter.where , offset : payload.page.offset , limit : payload.page.limit , include : payload.page.filter.include  }
			const requestToServer = this.TasksService.queryByObject(filter);
			// console.log(filter);
			// console.log(filter.where);
			// console.log(payload);
			// console.log(payload.page);
			const requestToServerCount = this.TasksService.countByObject(filter.where);
			const lastQuery = of(payload.page);
			return forkJoin(requestToServer, lastQuery,requestToServerCount);
		}),
		map(response => {
			// console.log(response + "11111");
			const result = response[0];
			const count:any = response[2];
			const lastQuery: QueryParamsModel = response[1];
			return new AllTasksLoaded({
				Tasks: result,
				totalCount: count.count,
				page: lastQuery
			});
		}),
	);

	@Effect()
    deleteTask$ = this.actions$
        .pipe(
            ofType<TaskDeleted>(TasksActionTypes.TaskDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.TasksService.deleteTask(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
		);

		@Effect()
		updateTask$ = this.actions$
			.pipe(
				ofType<TaskUpdated>(TasksActionTypes.TaskUpdated),
				mergeMap(( { payload } ) => {
					this.store.dispatch(this.showActionLoadingDistpatcher);
					return this.TasksService.updateTask(payload.Task);
				}),
				map(() => {
					return this.hideActionLoadingDistpatcher;
				}),
			);

		@Effect()
		createTask$ = this.actions$
			.pipe(
				ofType<TaskOnServerCreated>(TasksActionTypes.TaskOnServerCreated),
				mergeMap(( { payload } ) => {
					// console.log(payload);
					this.store.dispatch(this.showActionLoadingDistpatcher);
					return this.TasksService.createTask(payload.Task).pipe(
						tap(res => {
							this.store.dispatch(new TaskCreated({ Task: res }));
						})
					);
				}),
				map(() => {
					return this.hideActionLoadingDistpatcher;
				}),
			);

    constructor(private actions$: Actions, private TasksService: TaskService, private store: Store<AppState>) { }
}
