import {Entity, model, property} from '@loopback/repository';

@model()
export class Task extends Entity {
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
  TaskName: string;

  @property({
    type: 'string',
    required: true,
  })
  apiType: string;

  @property({
    type: 'date',
    required: true,
  })
  date: Date;

  @property({
    type: 'string',
    required: true,
  })
  time: string;

  @property({
    type: 'string',
    required: false,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  userFullName: string;

  @property({
    type: 'string',
    required: true,
  })
  userEmail: string;

  @property({
    type: 'boolean',
  })
  active?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted?: boolean;

  constructor(data?: Partial<Task>) {
    super(data);
  }
}

export interface TaskRelations {
  // describe navigational properties here
}

export type TaskWithRelations = Task & TaskRelations;
