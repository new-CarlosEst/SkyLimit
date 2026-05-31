import { useState } from "react";
import { sileo } from "sileo";
import type { PassengerCheckoutData } from "../types/checkout.types";

interface SeatData {
    seat: string | null;
    price: number;
}

interface UseSeatSelectionReturn {
    selectedSeats: Record<number, SeatData>;
    showSeatSelector: boolean;
    handleSeatSelect: (passengerIndex: number, seat: string | null, price: number) => void;
    handleContinueToSeats: (passengersData: PassengerCheckoutData[]) => void;
    handleBackToForm: () => void;
    handleContinueToPayment: (onComplete: (passengersWithSeats: PassengerCheckoutData[]) => void) => void;
    getTravelClass: () => string;
}

export function useSeatSelection(cabinClass: string | null, travelClass: string | null): UseSeatSelectionReturn {
    const [selectedSeats, setSelectedSeats] = useState<Record<number, SeatData>>({});
    const [showSeatSelector, setShowSeatSelector] = useState(false);
    const [formPassengersData, setFormPassengersData] = useState<PassengerCheckoutData[]>([]);

    const getTravelClass = () => {
        if (!cabinClass) return 'TURISTA';
        switch (cabinClass) {
            case 'economy':
                return 'TURISTA';
            case 'premiumeconomy':
                return 'TURISTA PREMIUM';
            case 'business':
                return 'EJECUTIVA';
            case 'first':
                return 'PRIMERA CLASE';
            default:
                return 'TURISTA';
        }
    };

    const handleSeatSelect = (passengerIndex: number, seat: string | null, price: number) => {
        setSelectedSeats(prev => ({
            ...prev,
            [passengerIndex]: { seat, price }
        }));
    };

    const handleContinueToSeats = (passengersData: PassengerCheckoutData[]) => {
        setFormPassengersData(passengersData);
        setShowSeatSelector(true);
        window.scrollTo(0, 0);
    };

    const handleBackToForm = () => {
        setShowSeatSelector(false);
        window.scrollTo(0, 0);
    };

    const handleContinueToPayment = (onComplete: (passengersWithSeats: PassengerCheckoutData[]) => void) => {
        const passengersPayload: PassengerCheckoutData[] = formPassengersData.map((passenger, pIdx) => {
            const seatData = selectedSeats[pIdx] || { seat: null, price: 0 };
            return {
                ...passenger,
                seat: {
                    seatNumber: seatData.seat,
                    price: seatData.price || 0,
                    cabin: travelClass || getTravelClass(),
                },
            };
        });

        const hasIncompletePassengers = passengersPayload.some((passenger) =>
            !passenger.name ||
            !passenger.surname ||
            !passenger.gender ||
            !passenger.birthDate ||
            !passenger.nationality ||
            !passenger.document.type ||
            !passenger.document.number ||
            !passenger.document.country ||
            !passenger.document.expirationDate,
        );

        if (hasIncompletePassengers) {
            sileo.error({
                title: "Faltan datos de pasajeros o documentos",
            });
            return;
        }

        onComplete(passengersPayload);
    };

    return {
        selectedSeats,
        showSeatSelector,
        handleSeatSelect,
        handleContinueToSeats,
        handleBackToForm,
        handleContinueToPayment,
        getTravelClass,
    };
}
