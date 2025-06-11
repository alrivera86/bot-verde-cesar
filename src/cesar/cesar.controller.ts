/* eslint-disable import/prefer-default-export */
import { Body, Controller, Patch, Post, HttpStatus, HttpException } from '@nestjs/common';
import * as fs from 'fs';
import { UpdateWriteOpResult } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CesarService } from './cesar.service';
import { CesarDocument } from './schemas/cesar.schema';
import { CesarUpdateData, UpdateCesarDto } from './dto/update-cesar.dto';
import { CreateCesarDto } from './dto/create-cesar.dto';
import { CesarRepository } from './cesar.repository';

@Controller('cesar')
export class CesarController {
  constructor(private readonly cesarService: CesarService, private readonly cesarRepository: CesarRepository) {}

  @Post()
  async createCesarEntry(@Body() body: CreateCesarDto): Promise<CesarDocument | object> {
    const postDataCesar: CreateCesarDto = plainToInstance(CreateCesarDto, body, { enableImplicitConversion: true });
    if (body.token === undefined || body.token === null || body.token !== process.env.TOKEN) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    // eslint-disable-next-line eqeqeq
    if (body.attempt == null || (body.attempt <= 1 && body.lat == 1 && body.lon == 1)) {
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    }
    fs.appendFile('cesar.log', `\nfromCesar: ${JSON.stringify(postDataCesar)}\n`, () => {});
    const response = await this.cesarService.createCesarEntry(postDataCesar);
    return response;
  }

  @Patch()
  async updateCesarEntries(@Body() body: UpdateCesarDto): Promise<UpdateWriteOpResult[]> {
    /* Get document which will be updated. */
    const patchDataCesar: UpdateCesarDto = plainToInstance(UpdateCesarDto, body);
    const cesarUpdatesBatch: CesarUpdateData[] = patchDataCesar.updatesBatch;
    const results: UpdateWriteOpResult[] = await this.cesarService.updateCesarBatch(cesarUpdatesBatch);
    return results;
  }
}
