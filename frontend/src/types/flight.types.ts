
//Formato de los datos de la respuesta
export interface FlightResult {
    id: string;
    price: {
        amount: number;
        currency: string;
        formatted: string;
    };
    legs: {
        origin: {
            iata: string;
            name: string;
            city: string;
            country: string;
        };
        destination: {
            iata: string;
            name: string;
            city: string;
            country: string;
        };
        departure: string;
        arrival: string;
        durationMinutes: number;
        stopCount: number;
        carriers: {
            name: string;
            logoUrl: string;
        }[];
    }[];
}

//Formato de los datos del store
export interface SearchResults {
    results: FlightResult[] | null;
    tripType: 'oneWay' | 'roundTrip' | 'multi' | null;
    setSearchResults: (results: FlightResult[], tripType: 'oneWay' | 'roundTrip' | 'multi') => void;
    clearSearchResults: () => void;
}

//Formato de los parámetros de búsqueda
export interface SearchParams {
    originIata: string | null;
    destinationIata: string | null;
    departureDate: string | null;
    returnDate: string | null; // Solo para roundTrip
    passengers: {
        adults: number;
        children: number;
        infants: number;
    } | null;
    cabinClass: 'economy' | 'premiumeconomy' | 'business' | 'first' | null;
    setSearchParams: (params: Omit<SearchParams, 'setSearchParams' | 'clearSearchParams'>) => void;
    clearSearchParams: () => void;
}
