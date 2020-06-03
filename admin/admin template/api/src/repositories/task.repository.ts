import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {TaskDataSource} from '../datasources';
import {Task, TaskRelations} from '../models';

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.id,
  TaskRelations
> {
  constructor(@inject('datasources.Task') dataSource: TaskDataSource) {
    super(Task, dataSource);
  }
}
