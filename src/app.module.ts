import { Module } from '@nestjs/common';
import { CesarModule } from './cesar/cesar.module';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

const cfgModule = ConfigModule.forRoot({ isGlobal: true });

@Module({
  imports: [
    cfgModule, // DO NOT MOVE THIS IMPORT FROM POSITION 0
    CesarModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI + '/' + process.env.MONGODB_DB
    ),
  ],
  controllers: [HealthController],
  providers: [HealthService]
})
export class AppModule { }
