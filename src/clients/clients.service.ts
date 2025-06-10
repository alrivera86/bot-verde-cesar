import { Injectable } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { FilterQuery } from 'mongoose';
import { ClientDocument } from './schemas/clients.schema';

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientsRepository) { }

  /** 
   * Retrieve the first document that matches some given properties.
   * @param filter Object to filter the documents with.
   * @returns The first matched document.
   */
  async findOne(filter: FilterQuery<ClientDocument>): Promise<ClientDocument> {
    return this.clientsRepository.findOne(filter);
  }

  async findByCommunityId(communityId: number):
    Promise<ClientDocument[]> {
    return this.clientsRepository.findByCommunityId(communityId);
  }
}
