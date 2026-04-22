export class StopoverEntity {
  order: number;
  origin: string;
  departure: string;
  destination: string;
  arrival: string;
  durationMinutes: number;
}

export class AirportDetail {
  iata: string;
  name: string;
  city: string;
  country: string;
}

export class LegEntity {
  origin: AirportDetail;
  destination: AirportDetail;
  departure: string;
  arrival: string;
  durationMinutes: number;
  stopCount: number;
  carriers: {
    name: string;
    logoUrl: string;
  }[];
  stopovers?: StopoverEntity[];
}

export class FlightEntity {
  id: string;
  price: {
    amount: number;
    currency: string;
    formatted: string;
  };
  legs: LegEntity[];
  bookingUrl?: string;
}
