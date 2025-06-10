import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ExecException } from 'child_process';

export type CesarDocument = HydratedDocument<Cesar>

export class CesarLocation {
  @Prop()
  type: string;

  @Prop()
  coordinates: Array<number>;

  @Prop()
  roadAndNumber?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  country?: string;

  @Prop()
  fullAddress?: string;
}

export class AIError implements ExecException {
  cmd?: string;
  killed?: boolean;
  code?: number;
  signal?: NodeJS.Signals;
  name: string;
  message: string;
  stack?: string;
}

@Schema()
export class Cesar {
  @Prop()
  loc: CesarLocation;

  @Prop()
  volt: number;

  @Prop()
  dist: number;

  @Prop()
  dp: number;

  @Prop()
  qp: number;

  @Prop()
  d0: number;

  @Prop()
  dT: number;

  @Prop()
  qPV: number;

  @Prop()
  fr: number;

  @Prop()
  id_c: number;

  @Prop()
  id_P: number;

  @Prop()
  id_b: number;

  @Prop()
  img: string;

  @Prop()
  created_at?: Date;

  @Prop()
  updated_at?: Date;

  @Prop()
  clase?: number;

  @Prop()
  confianza?: number;

  @Prop()
  docProcesadoPorIA?: boolean;

  @Prop()
  formattedAddress?: string;
  
  @Prop()
  previous_class?: number;

  @Prop({ require: false, type: Object })
  error?: AIError | string;

  @Prop()
  signal?: number;

  @Prop()
  attempt?: number;
}
export const CesarSchema = SchemaFactory.createForClass(Cesar);
