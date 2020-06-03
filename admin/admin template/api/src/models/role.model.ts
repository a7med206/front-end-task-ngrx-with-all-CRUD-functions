import {Entity, model, property} from '@loopback/repository';

@model()
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'number',
    required: true,
  })
  permissions: number[];

  @property({
    type: 'boolean',
    default: false,
  })
  isCoreRole?: boolean;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
