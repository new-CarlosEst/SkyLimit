import { create } from "zustand";
import type { FlightResult } from "../types/flight.types";

interface FlightSelectedState {
    selectedFlight: FlightResult | null;
    cabinClass: 'economy' | 'premiumeconomy' | 'business' | 'first' | null;
    passengers: {
        adults: number;
        children: number;
        infants: number;
    } | null;
    setSelectedFlight: (flight: FlightResult, cabinClass: 'economy' | 'premiumeconomy' | 'business' | 'first', passengers: { adults: number; children: number; infants: number }) => void;
    clearSelectedFlight: () => void;
}

export const useFlightSelectedStore = create<FlightSelectedState>((set) => ({
    selectedFlight: null,
    cabinClass: null,
    passengers: null,
    setSelectedFlight: (flight, cabinClass, passengers) => {
        set({ selectedFlight: flight, cabinClass, passengers });
    },
    clearSelectedFlight: () => {
        set({ selectedFlight: null, cabinClass: null, passengers: null });
    },
}));