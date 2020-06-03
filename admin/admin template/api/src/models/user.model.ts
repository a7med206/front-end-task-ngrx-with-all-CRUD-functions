import {Entity, model, property} from '@loopback/repository';
import {Address} from './address.model';
import {SocialNetworks} from './social-networks.model';

@model()
export class User extends Entity {
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
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  accessToken: string;

  @property({
    type: 'string',
    required: true,
  })
  refreshToken: string;

  @property({
    type: 'number',
    required: true,
  })
  roles: number[];

  @property({
    type: 'string',
    required: true,
  })
  pic: string;

  @property({
    type: 'string',
    required: true,
  })
  fullname: string;

  @property({
    type: 'string',
    required: true,
  })
  occupation: string;

  @property({
    type: 'string',
    required: true,
  })
  companyName: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  address: Address;

  @property({
    type: 'string',
    required: true,
  })
  socialNetworks: SocialNetworks;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted?: boolean;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
