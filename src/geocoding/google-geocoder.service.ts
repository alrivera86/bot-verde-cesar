import { Injectable } from '@nestjs/common/decorators';
import { Coordinates } from 'src/cesar/interfaces/coordinates.interface';
import { CesarLocation } from 'src/cesar/schemas/cesar.schema';
import { Client as GoogleMapsClient, GeocodeResult, Language, ReverseGeocodeRequest, ReverseGeocodeResponse, ReverseGeocodeResponseData, Status } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';
import { Geocoder } from './interfaces/geocoding.interface';
import { GoogleReverseGeocoderAddress } from './interfaces/google-geocoder-address.interface';
import AbstractGeocoder from './abstract-geocoder';

@Injectable()
// eslint-disable-next-line import/prefer-default-export
export class GoogleGeocoder extends AbstractGeocoder implements Geocoder {
  private readonly GOOGLE_MAPS_ACCESS_KEY = this.configService.get('GOOGLE_MAPS_ACCESS_KEY');

  private client: GoogleMapsClient;

  constructor(private configService: ConfigService) {
    super();
    this.client = new GoogleMapsClient();
  }

  async cesarReverseGeocode(coordinates: Coordinates): Promise<CesarLocation> {
    const request: ReverseGeocodeRequest = {
      params: {
        latlng: {
          lat: coordinates.lat,
          lng: coordinates.lon
        },
        key: this.GOOGLE_MAPS_ACCESS_KEY,
        language: Language.es
      }
    };

    /** Query for the reverse geocodification. */
    const reverseResponse: ReverseGeocodeResponse = await this.client.reverseGeocode(request);
    const reverseResult: ReverseGeocodeResponseData = reverseResponse.data;
    if (reverseResult.status === Status.OK) {
      /** Parse results. */
      const locationData: GeocodeResult = reverseResult.results[0];
      const googleAddress: Partial<GoogleReverseGeocoderAddress> = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const addressComponent of locationData.address_components) {
        googleAddress[addressComponent.types[0]] = addressComponent.long_name;
      }

      /** Transform to business format. */
      const locationResult: CesarLocation = {
        type: 'Point',
        coordinates: [coordinates.lat, coordinates.lon],
        roadAndNumber: `${googleAddress.route} ${googleAddress.street_number}`,
        city: googleAddress.administrative_area_level_3,
        state: googleAddress.administrative_area_level_1,
        country: googleAddress.country,
        fullAddress: locationData.formatted_address
      };

      return locationResult;
    }
    if (reverseResult.status === Status.ZERO_RESULTS) {
      const locationResult: CesarLocation = {
        type: 'Point',
        coordinates: [coordinates.lat, coordinates.lon],
        roadAndNumber: null,
        city: null,
        state: null,
        country: null,
        fullAddress: null
      };

      return locationResult;
    }
    throw new Error(reverseResult.error_message);
  }
}
