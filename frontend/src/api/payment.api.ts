import apiClient from "./cliente";
import { useAuthStore } from "../store/authStore";

export interface VerifyPaymentPayload {
    amount: number;
    paymentMethodId: string;
    reservationId: string;
    email: string;
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

export interface AddPaymentMethodPayload {
    holderName: string;
    brand: string;
    expirationDate: string;
    last4Digits: string;
    stripePaymentMethodId: string;
}

export interface AddPaymentMethodResponse {
    success: boolean;
    paymentMethodId: number;
    message: string;
}

export const verifyPayment = async (
    payload: VerifyPaymentPayload,
): Promise<VerifyPaymentResponse> => {
    const response = await apiClient.post<VerifyPaymentResponse>("/payment/verify", payload);
    return response.data;
};

export const addPaymentMethod = async (
    payload: AddPaymentMethodPayload,
): Promise<AddPaymentMethodResponse> => {
    const { user } = useAuthStore.getState();
    
    if (!user?.id) {
        throw new Error("User not authenticated");
    }

    const response = await apiClient.post<AddPaymentMethodResponse>("/payment/add-method", payload, {
        params: {
            userId: user.id,
        },
    });

    return response.data;
};

export interface PaymentMethod {
    id: number;
    holderName: string;
    brand: string;
    expirationDate: string;
    last4Digits: string;
    stripeCustomerId: string;
    stripePaymentMethodId: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetUserPaymentMethodsResponse {
    success: boolean;
    paymentMethods: PaymentMethod[];
}

export const getUserPaymentMethods = async (): Promise<GetUserPaymentMethodsResponse> => {
    const { user } = useAuthStore.getState();
    
    if (!user?.id) {
        throw new Error("User not authenticated");
    }

    const response = await apiClient.get<GetUserPaymentMethodsResponse>("/payment/user-methods", {
        params: {
            userId: user.id,
        },
    });

    return response.data;
};

export interface DeletePaymentMethodResponse {
    success: boolean;
    message: string;
}

export const deletePaymentMethod = async (paymentMethodId: number): Promise<DeletePaymentMethodResponse> => {
    const { user } = useAuthStore.getState();
    
    if (!user?.id) {
        throw new Error("User not authenticated");
    }

    const response = await apiClient.delete<DeletePaymentMethodResponse>("/payment/delete-method", {
        params: {
            paymentMethodId,
            userId: user.id,
        },
    });

    return response.data;
};

