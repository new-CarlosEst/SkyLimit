import { create } from "zustand";
import type { FlightResult, SearchResults } from "../types/flight.types"; //Pone que FlightResult no se usa, pero lo necesito para el tipo de dato

//Store para guardar los resultados de búsqueda de vuelos
export const useFlightSearchStore = create<SearchResults>()(
    (set) => ({
        results: null,
        tripType: null,
        setSearchResults: (results, tripType) => set({ results, tripType }),
        clearSearchResults: () => set({ results: null, tripType: null }),
    })
);
