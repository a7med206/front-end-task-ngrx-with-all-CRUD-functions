import {Entity, model, property} from '@loopback/repository';

@model()
export class Permission extends Entity {
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
  level: number;

  @property({
    type: 'number',
    required: true,
  })
  parentId: number;

  @property({
    type: 'boolean',
    default: false,
  })
  isSelected?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  _children: Permission[];

  constructor(data?: Partial<Permission>) {
    super(data);
  }
}

export interface PermissionRelations {
  // describe navigational properties here
}

export type PermissionWithRelations = Permission & PermissionRelations;
