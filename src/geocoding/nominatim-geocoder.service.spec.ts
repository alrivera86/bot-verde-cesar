import { Test, TestingModule } from '@nestjs/testing';
import { NominatimGeocoder } from './nominatim-geocoder.service';

describe('GeocodingService', () => {
  let service: NominatimGeocoder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NominatimGeocoder],
    }).compile();

    service = module.get<NominatimGeocoder>(NominatimGeocoder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
