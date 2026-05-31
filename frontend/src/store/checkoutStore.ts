import { create } from "zustand";
import type { FlightResult } from "../types/flight.types";
import type {
    CheckoutSavedPaymentCard,
    CheckoutReservationPayload,
    FareType,
    PassengerCheckoutData,
} from "../types/checkout.types";

interface CheckoutState {
    travelClass: string | null;
    selectedFlight: FlightResult | null;
    fareType: FareType;
    checkedBag: boolean;
    baggagePricePerPassenger: number;
    passengers: PassengerCheckoutData[];
    paymentCard: CheckoutSavedPaymentCard | null;
    reservationId: number | null;
    stripePaymentIntentId: string | null;
    setFlightConfig: (params: {
        travelClass: string;
        selectedFlight: FlightResult;
        fareType: FareType;
        checkedBag: boolean;
        baggagePricePerPassenger: number;
    }) => void;
    setPassengers: (passengers: PassengerCheckoutData[]) => void;
    setPaymentCard: (paymentCard: CheckoutSavedPaymentCard) => void;
    setPaymentResult: (reservationId: number, stripePaymentIntentId: string) => void;
    buildReservationPayload: () => CheckoutReservationPayload | null;
    clearCheckout: () => void;
}

const initialState = {
    travelClass: null,
    selectedFlight: null,
    fareType: "BASIC" as FareType,
    checkedBag: false,
    baggagePricePerPassenger: 0,
    passengers: [] as PassengerCheckoutData[],
    paymentCard: null,
    reservationId: null,
    stripePaymentIntentId: null,
};

export const useCheckoutStore = create<CheckoutState>()((set, get) => ({
    ...initialState,
    setFlightConfig: ({ travelClass, selectedFlight, fareType, checkedBag, baggagePricePerPassenger }) => {
        set({
            travelClass,
            selectedFlight,
            fareType,
            checkedBag,
            baggagePricePerPassenger,
        });
    },
    setPassengers: (passengers) => set({ passengers }),
    setPaymentCard: (paymentCard) => set({ paymentCard }),
    setPaymentResult: (reservationId, stripePaymentIntentId) =>
        set({ reservationId, stripePaymentIntentId }),
    buildReservationPayload: () => {
        const state = get();
        if (!state.selectedFlight || !state.travelClass || state.passengers.length === 0) {
            return null;
        }

        const totalPrice =
            state.selectedFlight.price.amount +
            state.passengers.length * state.baggagePricePerPassenger +
            state.passengers.reduce((sum, passenger) => sum + passenger.seat.price, 0);

        console.log("buildReservationPayload - state.selectedFlight.price.amount:", state.selectedFlight.price.amount);
        console.log("buildReservationPayload - totalPrice:", totalPrice);

        // Simplificar selectedFlight para enviar solo los datos necesarios
        const simplifiedSelectedFlight = {
            id: state.selectedFlight.id,
            source: state.selectedFlight.source,
            price: {
                amount: state.selectedFlight.price.amount,
            },
            legs: state.selectedFlight.legs.map(leg => ({
                origin: {
                    iata: leg.origin.iata,
                },
                destination: {
                    iata: leg.destination.iata,
                },
                departure: leg.departure,
                arrival: leg.arrival,
                durationMinutes: leg.durationMinutes,
                stopCount: leg.stopCount,
                carriers: leg.carriers.map(carrier => ({
                    name: carrier.name,
                })),
            })),
        };

        const payload = {
            travelClass: state.travelClass,
            fareType: state.fareType,
            checkedBag: state.checkedBag,
            baggagePricePerPassenger: state.baggagePricePerPassenger,
            selectedFlight: simplifiedSelectedFlight,
            totalPrice,
            passengers: state.passengers,
        };

        console.log("buildReservationPayload - payload:", payload);
        return payload;
    },
    clearCheckout: () => set({ ...initialState }),
}));

