import { Coordinates } from 'src/cesar/interfaces/coordinates.interface';
import { CesarLocation } from 'src/cesar/schemas/cesar.schema';

export const GEOCODING_INTERFACE = 'GEOCODING_INTERFACE';

export interface Geocoder {
  /**
   * Return full location properties for a Cesar object, including road name and
   * number, city, state, country and full address.
   * @param coordinates Values which its full location properties want to be
   * known.
   * @returns A {@link CesarLocation} object containing all said properties.
   */
  cesarReverseGeocode(coordinates: Coordinates): Promise<CesarLocation>;
}
