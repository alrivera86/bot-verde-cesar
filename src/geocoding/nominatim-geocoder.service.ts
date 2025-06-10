import { Injectable } from '@nestjs/common';
import { NominatimClient, ReverseOptions } from 'nominatim-client';
import nominatim from 'nominatim-client';
import { ExtendedReverseResult } from 'src/cesar/interfaces/extended-reverse-result.interface';
import { CesarLocation } from 'src/cesar/schemas/cesar.schema';
import { Geocoder } from './interfaces/geocoding.interface';
import { Coordinates } from 'src/cesar/interfaces/coordinates.interface';

@Injectable()
export class NominatimGeocoder implements Geocoder {
  private geocoderClient: NominatimClient;

  constructor() {
    this.geocoderClient = nominatim.createClient({
      /**
       * THESE ARGUMENTS CANNOT BE EMPTY STRINGS, otherwise methods will
       * fail
       */
      useragent: 'MyApp',
      referer: 'http://example.com'
    });
  }

  async cesarReverseGeocode(coordinates: Coordinates): Promise<CesarLocation> {
    const reverseGeocoding: ExtendedReverseResult = await this.geocoderClient
      .reverse(coordinates as ReverseOptions);

    /** Build human readable short address. */
    let shortAddress: string = '';
    if (reverseGeocoding.address.building) {
      shortAddress += reverseGeocoding.address.building + ' ';
    }
    shortAddress += reverseGeocoding.address.road;
    if (reverseGeocoding.address.house_number) {
      shortAddress += ' ' + reverseGeocoding.address.house_number;
    }

    /** Parse location properties. */
    const location: CesarLocation = {
      type: 'Point',
      coordinates: [coordinates.lon, coordinates.lat],
      roadAndNumber: shortAddress,
      city: reverseGeocoding.address.city,
      state: reverseGeocoding.address.state,
      country: reverseGeocoding.address.country,
      fullAddress: reverseGeocoding.display_name
    };

    return location;
  }
}
