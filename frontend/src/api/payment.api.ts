import apiClient from "./cliente";

export interface VerifyPaymentPayload {
    amount: number;
    paymentMethodId: string;
    reservationId: string;
    userId: string;
    cardholderName: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    transactionId: number;
    stripePaymentIntentId: string;
    amount: number;
    status: string;
    cardBrand: string;
    cardLast4: string;
    message: string;
}

export const verifyPayment = async (
    payload: VerifyPaymentPayload,
): Promise<VerifyPaymentResponse> => {
    const response = await apiClient.post<VerifyPaymentResponse>("/payment/verify", payload);
    return response.data;
};

