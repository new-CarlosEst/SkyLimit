import { create } from "zustand";
import type { SearchResults, FlightResult } from "../types/flight.types";

type SortOption = 'price' | 'duration' | 'stops' | 'departure' | 'arrival' | null;

type SortDirection = 'asc' | 'desc';

//Interfaz para ordenar los resultados 
interface ExtendedSearchResults extends SearchResults {
    sortBy: SortOption;
    sortDirection: SortDirection;
    setSortBy: (sortBy: SortOption) => void;
    getSortedResults: () => FlightResult[] | null;
}

//Store para guardar los resultados de búsqueda de vuelos
export const useFlightSearchStore = create<ExtendedSearchResults>()(
    (set, get) => ({
        results: null,
        tripType: null,
        sortBy: null,
        sortDirection: 'asc',
        setSearchResults: (results, tripType) => set({ results, tripType }),
        clearSearchResults: () => set({ results: null, tripType: null, sortBy: null, sortDirection: 'asc' }),
        setSortBy: (sortBy) => {
            const { sortBy: currentSortBy, sortDirection: currentDirection } = get();
            
            if (sortBy === currentSortBy) {
                // Si es el mismo criterio, cambiar dirección
                set({ sortDirection: currentDirection === 'asc' ? 'desc' : 'asc' });
            } else {
                // Si es diferente criterio, establecer ascendente por defecto
                set({ sortBy, sortDirection: 'asc' });
            }
        },
        getSortedResults: () => {
            const { results, sortBy, sortDirection } = get();
            if (!results || !sortBy) return results;

            const sorted = [...results].sort((a, b) => {
                let comparison = 0;
                switch (sortBy) {
                    case 'price':
                        comparison = a.price.amount - b.price.amount;
                        break;
                    case 'duration':
                        // Sumar duración de todas las legs
                        const totalDurationA = a.legs.reduce((sum, leg) => sum + leg.durationMinutes, 0);
                        const totalDurationB = b.legs.reduce((sum, leg) => sum + leg.durationMinutes, 0);
                        comparison = totalDurationA - totalDurationB;
                        break;
                    case 'stops':
                        // Sumar escalas de todas las legs
                        const totalStopsA = a.legs.reduce((sum, leg) => sum + leg.stopCount, 0);
                        const totalStopsB = b.legs.reduce((sum, leg) => sum + leg.stopCount, 0);
                        comparison = totalStopsA - totalStopsB;
                        break;
                    case 'departure':
                        comparison = new Date(a.legs[0].departure).getTime() - new Date(b.legs[0].departure).getTime();
                        break;
                    case 'arrival':
                        const lastArrivalA = a.legs[a.legs.length - 1].arrival;
                        const lastArrivalB = b.legs[b.legs.length - 1].arrival;
                        comparison = new Date(lastArrivalA).getTime() - new Date(lastArrivalB).getTime();
                        break;
                    default:
                        return 0;
                }
                
                // Aplicar dirección de ordenamiento
                return sortDirection === 'asc' ? comparison : -comparison;
            });

            return sorted;
        },
    })
);
