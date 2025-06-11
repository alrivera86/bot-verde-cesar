/* eslint-disable max-classes-per-file */
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCesarDto {
  @IsNotEmpty()
  @Type(() => Number)
  lat: number;

  @IsNotEmpty()
  @Type(() => Number)
  lon: number;

  @IsNotEmpty()
  @Type(() => Number)
  volt: number;

  @IsNotEmpty()
  @Type(() => Number)
  dist: number;

  @IsNotEmpty()
  @Type(() => Number)
  dp: number;

  @IsNotEmpty()
  @Type(() => Number)
  qp: number;

  @IsNotEmpty()
  @Type(() => Number)
  d0: number;

  @IsNotEmpty()
  @Type(() => Number)
  dT: number;

  @IsNotEmpty()
  @Type(() => Number)
  qPV: number;

  @IsNotEmpty()
  @Type(() => Number)
  fr: number;

  @IsNotEmpty()
  @Type(() => Number)
  id_c: number;

  @IsNotEmpty()
  @Type(() => Number)
  id_P: number;

  @IsNotEmpty()
  @Type(() => Number)
  id_b: number;

  @IsNotEmpty()
  img: string;

  @IsOptional()
  @Type(() => Number)
  communityId?: number;
  signal: number;

  @IsOptional()
  token: string;

  @IsOptional()
  @Type(() => Number)
  attempt: number;
}

export class PartialCesarDto extends PartialType(CreateCesarDto) {}
