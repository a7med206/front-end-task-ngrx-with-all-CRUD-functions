import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {TaskDataSource} from '../datasources';
import {Address, AddressRelations} from '../models';

export class AddressRepository extends DefaultCrudRepository<
  Address,
  typeof Address.prototype,
  AddressRelations
> {
  constructor(@inject('datasources.Task') dataSource: TaskDataSource) {
    super(Address, dataSource);
  }
}
