// Tipo que representa un aeropuerto devuelto por la API
export interface Airport {
    id: number;
    iata: string;
    name: string;
    country: string;
    city: string;
}

export interface Passengers {
    adults: number;
    children: number;
    infants: number;
}

export interface OneWayData {
    originName: string;
    destinationName: string,
    origin: string //Iata de origen
    departure: string //Iata de destino
    cabinClass: string //Clase de cabina
    date: string; //Fecha con formado YYYY-MM-DD
    adults: string;
    children?: string;
    infants?: string;
}

export interface RoundTripData {
    originName: string;
    destinationName: string,
    origin: string //Iata de origen
    departure: string //Iata de destino
    cabinClass: string //Clase de cabina
    date: string; //Fecha con formado YYYY-MM-DD
    returnDate: string; //Fecha con formado YYYY-MM-DD
    adults: string;
    children?: string;
    infants?: string;
}

export interface MultiTripData {
    legs: leg[];
    cabinClass: string;
    adults: string;
}

interface leg {
    originSkyId: string; //Iata de origen
    destinationSkyId: string; //Iata de destino
    date: string; //Fecha con formado YYYY-MM-DD
}
