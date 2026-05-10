import { create } from "zustand";
import type { FlightResult } from "../types/flight.types";

type DurationFilter = "short" | "medium" | "long" | "very-long" | "";
type StopFilter = "direct" | "one-stop" | "multi-stop" | "";

interface FilterState {
    priceRange: {
        min: number;
        max: number;
    };
    duration: DurationFilter | { [key: string]: string };
    stops: StopFilter;
    airlines: string[];
    setPriceRange: (range: { min: number; max: number }) => void;
    setDuration: (duration: DurationFilter | { [key: string]: string }) => void;
    setStops: (stops: StopFilter) => void;
    setAirlines: (airlines: string[]) => void;
    clearFilters: () => void;
    getFilteredResults: (results: FlightResult[]) => FlightResult[];
}

export const useFilterStore = create<FilterState>()(
    (set, get) => ({
        priceRange: { min: 0, max: 20000 },
        duration: "",
        stops: "",
        airlines: [],
        setPriceRange: (range) => set({ priceRange: range }),
        setDuration: (duration) => set({ duration }),
        setStops: (stops) => set({ stops }),
        setAirlines: (airlines) => set({ airlines }),
        clearFilters: () => set({ 
            priceRange: { min: 0, max: 20000 }, 
            duration: "", 
            stops: "", 
            airlines: [] 
        }),
        getFilteredResults: (results) => {
            const { priceRange, duration, stops, airlines } = get();
            
            if (!results) return results;
            
            return results.filter((flight) => {
                // Filtro por precio
                const flightPrice = flight.price.amount;
                console.log(`Price filter - Flight: ${flightPrice}, Range: ${priceRange.min}-${priceRange.max}`);
                if (flightPrice < priceRange.min || flightPrice > priceRange.max) {
                    console.log(`Flight ${flight.id} filtered out by price: ${flightPrice} not in range ${priceRange.min}-${priceRange.max}`);
                    return false;
                }
                
                // Filtro por duración
                if (duration) {
                    // Manejar tanto el formato antiguo (string) como el nuevo (objeto por leg)
                    if (typeof duration === "string") {
                        // Formato antiguo - filtrar por duración total
                        const totalMinutes = flight.legs.reduce((sum: number, leg: any) => sum + leg.durationMinutes, 0);
                        console.log(`Flight ${flight.id}: ${totalMinutes} minutes, filter: ${duration}`);
                        switch (duration) {
                            case "short":
                                if (totalMinutes >= 120) return false; // Menos de 2 horas
                                break;
                            case "medium":
                                if (totalMinutes < 120 || totalMinutes >= 240) return false; // 2-4 horas
                                break;
                            case "long":
                                if (totalMinutes < 240 || totalMinutes >= 360) return false; // 4-6 horas
                                break;
                            case "very-long":
                                if (totalMinutes < 360) return false; // Más de 6 horas
                                break;
                        }
                    } else {
                        // Formato nuevo - filtrar por leg individual
                        console.log(`Flight ${flight.id}: applying individual leg filters`, duration);
                        
                        // Verificar cada filtro de duración por leg
                        for (const [legKey, durationFilter] of Object.entries(duration)) {
                            if (!durationFilter) continue; // Saltar filtros vacíos
                            
                            let legIndex = 0;
                            if (legKey === "outbound") legIndex = 0;
                            else if (legKey === "return") legIndex = 1;
                            else if (legKey.startsWith("vuelo")) {
                                const vueloNum = parseInt(legKey.replace("vuelo", "")) - 1;
                                legIndex = vueloNum;
                            }
                            
                            if (legIndex < flight.legs.length) {
                                const legMinutes = flight.legs[legIndex].durationMinutes;
                                console.log(`Leg ${legKey}: ${legMinutes} minutes, filter: ${durationFilter}`);
                                
                                switch (durationFilter) {
                                    case "short":
                                        if (legMinutes >= 120) return false;
                                        break;
                                    case "medium":
                                        if (legMinutes < 120 || legMinutes >= 240) return false;
                                        break;
                                    case "long":
                                        if (legMinutes < 240 || legMinutes >= 360) return false;
                                        break;
                                    case "very-long":
                                        if (legMinutes < 360) return false;
                                        break;
                                }
                            }
                        }
                    }
                }
                
                // Filtro por escalas
                if (stops) {
                    const totalStops = flight.legs.reduce((sum: number, leg: any) => sum + leg.stopCount, 0);
                    switch (stops) {
                        case "direct":
                            if (totalStops !== 0) return false;
                            break;
                        case "one-stop":
                            if (totalStops !== 1) return false;
                            break;
                        case "multi-stop":
                            if (totalStops < 2) return false;
                            break;
                    }
                }
                
                // Filtro por aerolíneas
                if (airlines.length > 0) {
                    const flightAirlines = new Set<string>();
                    flight.legs.forEach((leg: any) => {
                        leg.carriers.forEach((carrier: any) => {
                            flightAirlines.add(carrier.name);
                        });
                    });
                    
                    const hasSelectedAirline = airlines.some(airline => flightAirlines.has(airline));
                    if (!hasSelectedAirline) return false;
                }
                
                return true;
            });
        },
    })
);
