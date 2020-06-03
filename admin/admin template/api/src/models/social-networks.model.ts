import {Entity, model, property} from '@loopback/repository';

@model()
export class SocialNetworks extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  linkedIn: string;

  @property({
    type: 'string',
    required: true,
  })
  facebook: string;

  @property({
    type: 'string',
    required: true,
  })
  twitter: string;

  @property({
    type: 'string',
    required: true,
  })
  instagram: string;

  constructor(data?: Partial<SocialNetworks>) {
    super(data);
  }
}

export interface SocialNetworksRelations {
  // describe navigational properties here
}

export type SocialNetworksWithRelations = SocialNetworks &
  SocialNetworksRelations;
