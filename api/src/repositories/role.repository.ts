import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {TaskDataSource} from '../datasources';
import {Role, RoleRelations} from '../models';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  constructor(@inject('datasources.Task') dataSource: TaskDataSource) {
    super(Role, dataSource);
  }
}
