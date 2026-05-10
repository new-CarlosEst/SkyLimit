import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getAirportById } from "../api/flights.api";
import type { Airport } from "../types/airport.types";

//Hook que te Checkea el aeropuerto favorito del usuario
interface UseFavoriteAirportReturn {
    favoriteAirport: Airport | null;
    selectedAirport: Airport | null;
    isLoading: boolean;
    fetchFavoriteAirport: (airportId: number) => Promise<void>;
    handleAirportSelect: (airport: Airport | null) => void;
    clearSelectedAirport: () => void;
}

export function useFavoriteAirport(): UseFavoriteAirportReturn {
    const { user } = useAuthStore();
    const [favoriteAirport, setFavoriteAirport] = useState<Airport | null>(null);
    const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar datos del aeropuerto favorito cuando el componente se monta o cuando cambia el usuario
    useEffect(() => {
        if (user?.favoriteAirportId) {
            fetchFavoriteAirport(user.favoriteAirportId);
        } else {
            setFavoriteAirport(null);
        }
    }, [user?.favoriteAirportId, user]); // Añadir user para detectar cambios completos del objeto usuario

    const fetchFavoriteAirport = async (airportId: number) => {
        setIsLoading(true);
        try {
            const airport = await getAirportById(airportId);
            setFavoriteAirport(airport);
        } catch (error) {
            console.error("Error al cargar aeropuerto favorito:", error);
            setFavoriteAirport(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAirportSelect = (airport: Airport | null) => {
        setSelectedAirport(airport);
    };

    const clearSelectedAirport = () => {
        setSelectedAirport(null);
    };

    return {
        favoriteAirport,
        selectedAirport,
        isLoading,
        fetchFavoriteAirport,
        handleAirportSelect,
        clearSelectedAirport
    };
}
