import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Task } from '../_models/Task.model';
import { Permission } from '../_models/permission.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { BaseApiService } from '../../_base/crud/api/baseApi';

const API_TaskS_URL = 'http://[::1]:3000/tasks';
// const API_PERMISSION_URL = 'api/permissions';
// const API_TaskS_URL = 'api/Tasks';

@Injectable()
export class TaskService extends BaseApiService<Task>{
	public baseUrl = environment.baseUrl;

    constructor( http: HttpClient) {
		super(http);
		this.url='/tasks'
	}

    deleteTask(TaskId: string) {
		const Task = { id: TaskId ,isDeleted : true}
		return this.save(Task)
	}
	findTask(TaskId): Observable<QueryResultsModel> {
		return this.http.get<QueryResultsModel>(this.baseUrl+ `${this.url}/` + TaskId, { headers: this.authorization()});
	 }
	 updateTask(_Task: Task): Observable<any> {
		let newTask = {
			id : _Task.id,
			TaskName : _Task.TaskName,
			apiType : _Task.apiType,
			active : _Task.active,
			userFullName : _Task.userFullName,
			description : _Task.description,
			date : _Task.date,
			time : _Task.time,
			userEmail : _Task.userEmail,
			isDeleted : _Task.isDeleted
		}
		 return this.save(newTask)
	}
	createTask(task: Task): Observable<Task> {
		let newTask = {
			id : task.id,
			TaskName : task.TaskName,
			apiType : task.apiType,
			active : task.active,
			userFullName : task.userFullName,
			description : task.description,
			date : task.date,
			time : task.time,
			userEmail : task.userEmail,
			isDeleted : task.isDeleted
		}
		   return this.save(newTask);
	}

    getAllTasks(): Observable<Task[]> {
		return this.http.get<Task[]>(API_TaskS_URL);
    }
}

//     // DELETE => delete the Task from the server
// 	deleteTask(TaskId: number) {
// 		const url = `${API_TaskS_URL}/${TaskId}`;
// 		return this.http.delete(url);
//     }

//     // UPDATE => PUT: update the Task on the server
// 	updateTask(_Task: Task): Observable<any> {
//         const httpHeaders = new HttpHeaders();
//         httpHeaders.set('Content-Type', 'application/json');
// 		      return this.http.put(API_TaskS_URL, _Task, { headers: httpHeaders });
// 	}

//     // CREATE =>  POST: add a new Task to the server
// 	createTask(Task: Task): Observable<Task> {
//     	const httpHeaders = new HttpHeaders();
//      httpHeaders.set('Content-Type', 'application/json');
// 		   return this.http.post<Task>(API_TaskS_URL, Task, { headers: httpHeaders});
// 	}

//     // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// 	// // items => filtered/sorted result
// 	findTasks(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
//         // const httpHeaders = new HttpHeaders();
//         // httpHeaders.set('Content-Type', 'application/json');
// 		      return this.http.get<QueryResultsModel>(API_TaskS_URL + '/findTasks');
//     }


//     // Tasks
//     getTaskById(TaskId: number): Observable<Task> {
// 		return this.http.get<Task>(API_TaskS_URL + `/${TaskId}`);
//     }


//     // Check Task Before deletion
//     isTaskAssignedToTasks(TaskId: number): Observable<boolean> {
//         return this.http.get<boolean>(API_TaskS_URL + '/checkIsRollAssignedToTask?TaskId=' + TaskId);
//     }


//     private handleError<T>(operation = 'operation', result?: any) {
//         return (error: any): Observable<any> => {
//             // TODO: send the error to remote logging infrastructure
//             console.error(error); // log to console instead

//             // Let the app keep running by returning an empty result.
//             return of(result);
//         };
//     }
// }
