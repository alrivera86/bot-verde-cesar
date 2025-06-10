import { Injectable } from "@nestjs/common";
import { Client, ClientDocument } from "./schemas/clients.schema";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>
  ) { }

  /**
   * Retrieve the first document that matches some given properties.
   * @param filter Object to filter the documents with.
   * @returns The first matched document.
   */
  async findOne(filter: FilterQuery<ClientDocument>): Promise<ClientDocument> {
    return this.clientModel.findOne(filter).exec();
  }

  async findByCommunityId(communityId: number): Promise<ClientDocument[]> {
    return this.clientModel.find({ communityId: communityId }).exec();
  }
}
