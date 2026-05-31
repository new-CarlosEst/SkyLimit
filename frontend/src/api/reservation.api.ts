import apiClient from "./cliente";
import type { CheckoutReservationPayload } from "../types/checkout.types";

export interface CreateReservationResponse {
    success: boolean;
    reservationId: number;
    status: string;
    totalPrice: number;
    message: string;
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

