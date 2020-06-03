// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { Task } from '../_models/task.model';
// Models
import { QueryParamsModel } from '../../_base/crud';
export enum TasksActionTypes {
    AllTasksRequested = '[Init] All Tasks Requested',
	AllTasksLoaded = '[Init] All Tasks Loaded',
	TasksPageLoaded = '[Tasks API] Tasks Page Loaded',
	TasksPageRequested = '[Tasks List Page] Tasks Page Requested',
	TaskDeleted = '[Tasks List Page] Task Deleted',
	TaskCreated = '[Edit Task Dialog] Task Created',
	TasksActionToggleLoading = '[Tasks] Tasks Action Toggle Loading',
	TaskUpdated = '[Edit Task Dialog] Task Updated',
	TaskOnServerCreated = '[Edit Task Dialog] Task On Server Created',
}

export class AllTasksRequested implements Action {
    readonly type = TasksActionTypes.AllTasksRequested;
}
export class TaskDeleted implements Action {
    readonly type = TasksActionTypes.TaskDeleted;
    constructor(public payload: { id: any, isDeleted: boolean }) {
	}
}
export class TaskCreated implements Action {
    readonly type = TasksActionTypes.TaskCreated;
    constructor(public payload: { Task: Task }) { }
}
export class AllTasksLoaded implements Action {
    readonly type = TasksActionTypes.AllTasksLoaded;
    constructor(public payload: { Tasks: Task[], totalCount: number, page: QueryParamsModel }) { }
}
export class TasksPageRequested implements Action {
    readonly type = TasksActionTypes.TasksPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}
export class TasksActionToggleLoading implements Action {
    readonly type = TasksActionTypes.TasksActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}
export class TaskUpdated implements Action {
    readonly type = TasksActionTypes.TaskUpdated;
    constructor(public payload: {
        partialTask: Update<Task>,
        Task: Task
    }) { }
}

export class TaskOnServerCreated implements Action {
    readonly type = TasksActionTypes.TaskOnServerCreated;
    constructor(public payload: { Task: Task }) { }
}

export type Tasks = AllTasksRequested | TaskCreated | AllTasksLoaded | TasksPageRequested | TasksActionToggleLoading | TaskDeleted | TaskUpdated | TaskOnServerCreated;
