// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { Tasks, TasksActionTypes } from '../_actions/task.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Task } from '../_models/task.model';

export interface TasksState extends EntityState<Task> {
	_isAllTasksLoaded: boolean;
	listLoading: boolean;
	actionsloading: boolean;
	lastCreatedTasksId: number;
	allDevicesModles: any ,
	totalCount: number;
    lastQuery: QueryParamsModel;
}

export const adapter: EntityAdapter<Task> = createEntityAdapter<Task>();

export const initialTaskstate: TasksState = adapter.getInitialState({
	_isAllTasksLoaded: false,
	listLoading: false,
	lastCreatedTasksId: undefined,
	actionsloading: false,
	allDevicesModles:[],
	totalCount: 0,
    lastQuery:  new QueryParamsModel({}),
});

export function TasksReducer(state = initialTaskstate, action: Tasks): TasksState {
    switch  (action.type) {
        case TasksActionTypes.AllTasksRequested:
            return {...state,
                _isAllTasksLoaded: true
        };
		case TasksActionTypes.AllTasksLoaded: {
			return adapter.addMany(action.payload.Tasks, {
				...initialTaskstate,
				totalCount: action.payload.totalCount,
				lastQuery: action.payload.page,
				listLoading: false,
			});
		}
		case TasksActionTypes.TaskCreated: return adapter.addOne(action.payload.Task, {
            ...state, lastCreatedTasksId: action.payload.Task.id
        });
		case TasksActionTypes.TaskDeleted: return adapter.removeOne(action.payload.id, state);

		case TasksActionTypes.TasksActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        default:
            return state;
    }
}

export const getRoleState = createFeatureSelector<TasksState>('Tasks');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
