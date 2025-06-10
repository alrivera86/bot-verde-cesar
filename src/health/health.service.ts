import { Injectable } from '@nestjs/common';
import { HealthOutputDto } from './dto/health-output.dto';

@Injectable()
export class HealthService {
  public getHealth(): HealthOutputDto {
    return {
      message: 'bot_verde_cesar is running'
    };
  }
}
