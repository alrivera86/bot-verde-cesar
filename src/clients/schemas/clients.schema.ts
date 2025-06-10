import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
  @Prop()
  name: string;

  @Prop()
  communityId: number;

  @Prop()
  createdAt: Date;

  @Prop([Number])
  pviId: number[];

  @Prop()
  logo: string;

  @Prop()
  mail?: string;

  @Prop()
  filter: Array<string>;
}

export const ClientSchema = SchemaFactory.createForClass(Client)