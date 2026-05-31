import type { FlightResult } from "./flight.types";

export type FareType = "BASIC" | "CLASSIC";

export interface PassengerDocumentData {
    type: string;
    number: string;
    country: string;
    expirationDate: string;
}

export interface PassengerCheckoutData {
    type: "Adulto" | "Niño" | "Bebé";
    name: string;
    surname: string;
    gender: string;
    birthDate: string;
    nationality: string;
    email: string;
    phone: string;
    document: PassengerDocumentData;
    seat: {
        seatNumber: string | null;
        cabin: string;
        price: number;
    };
}

export interface CheckoutPaymentCard {
    brand: string;
    type: string;
    number: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    paymentMethodId: string;
}

export interface CheckoutSavedPaymentCard extends CheckoutPaymentCard {
    cardholderName: string;
}

export interface CheckoutReservationPayload {
    travelClass: string;
    fareType: FareType;
    checkedBag: boolean;
    baggagePricePerPassenger: number;
    selectedFlight: FlightResult;
    totalPrice: number;
    passengers: PassengerCheckoutData[];
}

