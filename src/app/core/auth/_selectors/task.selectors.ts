// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { TasksState } from '../_reducers/task.reducers';
import { each } from 'lodash';
import { Task } from '../_models/task.model';

export const selectTasksState = createFeatureSelector<TasksState>('Tasks');

export const selectTaskById = (TaskId: string) => createSelector(
    selectTasksState,
    ps => ps.entities[TaskId]
);

export const selectTasksActionLoading = createSelector(
    selectTasksState,
    TasksState => TasksState.actionsloading
);
export const selectTasksPageLoading = createSelector(
    selectTasksState,
    TasksState =>  TasksState.listLoading

);
export const lastCreatedTasksId = createSelector(
    selectTasksState,
    TasksState => TasksState.lastCreatedTasksId
);

export const selectTasksInStore = createSelector(
    selectTasksState,
    TasksState => {
        const items: Task[] = [];
        each(TasksState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: Task[] = httpExtension.sortArray(items, TasksState.lastQuery.sortField, TasksState.lastQuery.sortOrder);
        return new QueryResultsModel(result, TasksState.totalCount, '');
    }
);

export const allTasksLoaded = createSelector(
    selectTasksState,
    TasksState => TasksState._isAllTasksLoaded
);
