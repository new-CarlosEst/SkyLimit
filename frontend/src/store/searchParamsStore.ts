import { create } from "zustand";
import type { SearchParams } from "../types/flight.types";

//Store para guardar los parámetros de búsqueda de vuelos
export const useSearchParamsStore = create<SearchParams>()(
    (set) => ({
        originIata: null,
        destinationIata: null,
        departureDate: null,
        returnDate: null,
        passengers: null,
        cabinClass: null,
        setSearchParams: (params) => set(params),
        clearSearchParams: () => set({
            originIata: null,
            destinationIata: null,
            departureDate: null,
            returnDate: null,
            passengers: null,
            cabinClass: null,
        }),
    })
);
