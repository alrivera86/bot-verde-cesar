/* eslint-disable max-classes-per-file */
import { Type } from 'class-transformer';
import { AIError, CesarDocument } from '../schemas/cesar.schema';

export class NewCesarData {
  error?: AIError;

  docProcesadoPorIA = true;

  prediction?: {
    confianza: number;
    clase: number;
  };

  previous_class?: number;
}

export class CesarUpdateData {
  doc: CesarDocument;

  newData: NewCesarData;
}

export class UpdateCesarDto {
  @Type(() => CesarUpdateData)
  updatesBatch: CesarUpdateData[];
}
