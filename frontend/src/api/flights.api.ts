// Importo tipos
import type { Airport, OneWayData, RoundTripData, MultiTripData } from "../types/airport.types";
// Importo el cliente de axios
import apiClient from "./cliente";


/**
 * Busca aeropuertos por nombre (coincidencia parcial)
 * Solo hace la petición si hay al menos 1 carácter
 * @param name - Texto a buscar
 * @returns Lista de aeropuertos que coinciden
 */
export const searchAirports = async (name: string): Promise<Airport[]> => {
    if (!name || name.trim().length === 0) return [];

    const response = await apiClient.get<Airport[]>("/airport/search", {
        params: { name: name.trim() },
    });

    return response.data;
};

/**
 * Obtiene un aeropuerto por su ID
 * @param id - ID del aeropuerto
 * @returns Datos del aeropuerto o null si no existe
 */
export const getAirportById = async (id: number): Promise<Airport | null> => {
    const response = await apiClient.get<Airport>(`/airport/airportById`, {
        params: { id }
    });
    
    return response.data;
};


export const searchOneWay = async (flightData : OneWayData) => {
    const response = await apiClient.get("apiflight/oneWay", {
        params: {
            ...flightData,
            cabinClass: flightData.cabinClass.replace(/\s+/g, '') // Eliminar espacios del cabinClass
        }
    });
    return response.data;
}

export const searchRoundTrip = async (flightData : RoundTripData) => {
    const response = await apiClient.get("apiflight/roundTrip", {
        params: {
            ...flightData,
            cabinClass: flightData.cabinClass.replace(/\s+/g, '') // Eliminar espacios del cabinClass
        }
    });
    return response.data;
}

export const searchMultiTrip = async (flightData : MultiTripData) => {
    const response = await apiClient.get("apiflight/multi", {
        params: {
            legs: JSON.stringify(flightData.legs),
            cabinClass: flightData.cabinClass,
            adults: flightData.adults,
        }
    });
    return response.data;
}

/**
 * Crea un nuevo vuelo
 * @param flightData - Datos del vuelo a crear
 * @returns Respuesta del servidor con el vuelo creado
 */
export const createFlight = async (flightData: {
    flightNumber: string;
    departureDateTime: string;
    arrivalDateTime: string;
    airline: string;
    price: number;
    airportDepartureId: number;
    airportArrivalId: number;
    stopoverCount?: number;
    flightDuration?: number;
    source?: string;
}) => {
    return apiClient.post("/flight/create", flightData);
}
    
