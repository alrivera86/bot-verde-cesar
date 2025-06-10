import { ReverseResult } from "nominatim-client";

export interface ExtendedReverseResult extends ReverseResult {
  address: {
    amenity: string;
    road: string;
    suburb: string;
    city_district: string;
    city: string;
    county: string;
    state: string;
    postcode: string;
    country: string;
    country_code: string;
    building?: string;
    house_number?: string;
  };
}