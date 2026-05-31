import { useState } from 'react';
import { useFlightSelectedStore } from '../store/flightSelectedStore';
import { useSearchParamsStore } from '../store/searchParamsStore';
import type { FlightResult } from '../types/flight.types';

interface UseFlightSelectorReturn {
    selectedFlight: FlightResult | null;
    cabinClass: 'economy' | 'premiumeconomy' | 'business' | 'first' | null;
    passengersCount: number;
    flightToDisplay: FlightResult;
    isClassic: boolean;
    addCheckedBag: boolean;
    extraBaggagePrice: number;
    handleToggleClassic: (value: boolean) => void;
    handleToggleCheckedBag: (value: boolean) => void;
}

export function useFlightSelector(): UseFlightSelectorReturn {
    const { selectedFlight, cabinClass } = useFlightSelectedStore();
    const { passengers } = useSearchParamsStore();

    const [isClassic, setIsClassic] = useState(false);
    const [addCheckedBag, setAddCheckedBag] = useState(false);

    const passengersCount = passengers ? (passengers.adults + passengers.children + passengers.infants) : 2;

    // Mock flight for visualization purposes
    const mockFlight: FlightResult = {
        id: "mock1",
        price: { amount: 794, currency: "EUR", formatted: "794€" },
        legs: [
            {
                origin: { iata: "MAD", name: "Madrid", city: "Madrid", country: "ES" },
                destination: { iata: "BCN", name: "Barcelona", city: "Barcelona", country: "ES" },
                departure: "2026-05-30T21:35:00",
                arrival: "2026-05-30T22:50:00",
                durationMinutes: 75,
                stopCount: 0,
                carriers: [{ name: "Iberia", logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/IB.png" }]
            },
            {
                origin: { iata: "BCN", name: "Barcelona", city: "Barcelona", country: "ES" },
                destination: { iata: "MAD", name: "Madrid", city: "Madrid", country: "ES" },
                departure: "2026-06-05T14:50:00",
                arrival: "2026-06-05T16:15:00",
                durationMinutes: 85,
                stopCount: 0,
                carriers: [{ name: "Iberia", logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/IB.png" }]
            }
        ]
    };

    const flightToDisplay = selectedFlight || mockFlight;

    // Calculate extra baggage price
    const extraBaggagePrice = (cabinClass === 'economy' || !cabinClass) 
        ? (isClassic ? 35 : (addCheckedBag ? 30 : 0)) 
        : 0;

    const handleToggleClassic = (value: boolean) => {
        setIsClassic(value);
        if (value) setAddCheckedBag(false);
    };

    const handleToggleCheckedBag = (value: boolean) => {
        setAddCheckedBag(value);
        if (value) setIsClassic(false);
    };

    return {
        selectedFlight,
        cabinClass,
        passengersCount,
        flightToDisplay,
        isClassic,
        addCheckedBag,
        extraBaggagePrice,
        handleToggleClassic,
        handleToggleCheckedBag,
    };
}
