import { Module } from '@nestjs/common';
import { GEOCODING_INTERFACE } from './interfaces/geocoding.interface';
import { GoogleGeocoder } from './google-geocoder.service';

const geocodingService = {
  useClass: GoogleGeocoder,
  provide: GEOCODING_INTERFACE
};

@Module({
  providers: [geocodingService],
  exports: [geocodingService]
})
// eslint-disable-next-line import/prefer-default-export
export class GeocodingModule {}
