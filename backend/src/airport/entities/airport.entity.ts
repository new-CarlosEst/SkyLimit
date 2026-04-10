export class Airport {
  id: number;
  iata: string;
  name: string;
  country: string;
  city: string;

  // Relations (comentadas hasta que existan las entities)
  // departures?: Flight[];
  // arrivals?: Flight[];
  // stopovers?: Flight[];
  // favoriteUsers?: User[];
}
