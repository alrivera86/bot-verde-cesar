import { Module } from '@nestjs/common';
import { CesarController } from './cesar.controller';
import { CesarService } from './cesar.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cesar, CesarSchema } from './schemas/cesar.schema';
import { CesarRepository } from './cesar.repository';
import { ClientsModule } from 'src/clients/clients.module';
import { MailsModule } from 'src/mails/mails.module';
import { GeocodingModule } from 'src/geocoding/geocoding.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cesar.name, schema: CesarSchema, collection: 'pings' }
    ]),
    MailsModule,
    ClientsModule,
    GeocodingModule
  ],
  controllers: [CesarController],
  providers: [CesarRepository, CesarService]
})
export class CesarModule { }
