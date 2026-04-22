import { create } from "zustand";
import type { SearchResults } from "../types/flight.types";

//Store para guardar los resultados de búsqueda de vuelos
export const useFlightSearchStore = create<SearchResults>()(
    (set) => ({
        results: null,
        tripType: null,
        setSearchResults: (results, tripType) => set({ results, tripType }),
        clearSearchResults: () => set({ results: null, tripType: null }),
    })
);
