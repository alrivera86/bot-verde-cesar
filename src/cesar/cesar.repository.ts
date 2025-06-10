import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import * as fs from 'fs';
import { Cesar, CesarDocument } from './schemas/cesar.schema';

@Injectable()
export class CesarRepository {
  constructor(
    @InjectModel(Cesar.name) private readonly cesarModel: Model<Cesar>
  ) { }

  public async create(cesarFormatted: Cesar): Promise<CesarDocument> {
    const responseCreatedCesar = await this.cesarModel.create(cesarFormatted);
    fs.appendFile('cesar.log', '\nreturnToCesar: ' + JSON.stringify(responseCreatedCesar) + '\n', () => { });
    return responseCreatedCesar;
  }

  /**
   * Retrieve all documents in the associated collection.
   * @returns An array containing all those documents.
   */
  async find(filter: FilterQuery<CesarDocument>): Promise<CesarDocument[]> {
    return this.cesarModel.find(filter);
  }

  /**
   * Get the Mongoose Model associated with this object instance.
   * @returns The Mongoose Model.
   */
  getModel(): Model<Cesar> {
    return this.cesarModel;
  }

  async updateMany(filter: FilterQuery<CesarDocument>,
    update: UpdateQuery<CesarDocument>) {
    return this.cesarModel.updateMany(filter, update);
  }
}
