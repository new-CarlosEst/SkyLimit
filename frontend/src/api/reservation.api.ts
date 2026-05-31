import apiClient from "./cliente";
import type { CheckoutReservationPayload } from "../types/checkout.types";
import { useAuthStore } from "../store/authStore";

export interface CreateReservationResponse {
    success: boolean;
    reservationId: number;
    status: string;
    totalPrice: number;
    message: string;
}

export interface ReservationFlight {
    id: number;
    order: number;
    flight: {
        id: number;
        flightNumber: string;
        departureDateTime: string;
        arrivalDateTime: string;
        airline: string;
        airportDeparture: {
            iata: string;
            city: string;
            name: string;
        };
        airportArrival: {
            iata: string;
            city: string;
            name: string;
        };
    };
}

export interface Transaction {
    id: number;
    amount: number;
    status: string;
    cardBrand?: string;
    cardLast4?: string;
}

export interface UserReservation {
    id: number;
    status: string;
    reservationDate: string;
    travelClass: string;
    price: number;
    reservationFlights: ReservationFlight[];
    passengers: any[];
    transactions: Transaction[];
}

export const createReservation = async (
    payload: CheckoutReservationPayload,
    token: string,
): Promise<CreateReservationResponse> => {
    const response = await apiClient.post<CreateReservationResponse>("/reservation/create", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const getUserReservations = async (): Promise<UserReservation[]> => {
    const { user } = useAuthStore.getState();
    
    if (!user?.id) {
        throw new Error("User not authenticated");
    }

    const response = await apiClient.get<UserReservation[]>("/reservation/user", {
        params: {
            userId: user.id,
        },
    });

    return response.data;
};

