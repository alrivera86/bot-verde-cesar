import { AIError } from "../schemas/cesar.schema";

export interface CesarAIUpdateQuery {
  error?: AIError;
  docProcesadoPorIA: boolean;
  previous_class?: number;
  confianza?: number;
  clase?: number;
}
