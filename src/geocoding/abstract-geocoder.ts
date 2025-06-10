import { Coordinates } from 'src/cesar/interfaces/coordinates.interface';
import { CesarLocation } from 'src/cesar/schemas/cesar.schema';
import { Geocoder } from './interfaces/geocoding.interface';

export default abstract class AbstractGeocoder implements Geocoder {
  abstract cesarReverseGeocode(coordinates: Coordinates): Promise<CesarLocation>;

  /**
   * Transform a {@link Coordinates} object to an array of the form [longitude, latitude].
   * @param coordinates The coordinates object to be transformed.
   */
  static toLonLatArray(coordinates: Coordinates): Array<number> {
    return [coordinates.lon, coordinates.lat];
  }

  /**
   * Transform a {@link Coordinates} object to an array of the form [latitude, longitude].
   * @param coordinates The coordinates object to be transformed.
   */
  static toLatLonArray(coordinates: Coordinates): Array<number> {
    return [coordinates.lat, coordinates.lon];
  }
}
