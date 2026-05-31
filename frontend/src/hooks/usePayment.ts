import { useState } from "react";
import { createReservation } from "../api/reservation.api";
import { verifyPayment } from "../api/payment.api";
import { useAuthStore } from "../store/authStore";
import { useCheckoutStore } from "../store/checkoutStore";
import type { CheckoutPaymentCard } from "../types/checkout.types";
import { sileo } from "sileo";

interface UsePaymentReturn {
    loading: boolean;
    selectedCard: CheckoutPaymentCard | null;
    setSelectedCard: (card: CheckoutPaymentCard | null) => void;
    handleCardSelect: (card: CheckoutPaymentCard) => void;
    handleInputChange: () => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function usePayment(
    showCardModal: boolean,
    setShowCardModal: (show: boolean) => void
): UsePaymentReturn {
    const [selectedCard, setSelectedCard] = useState<CheckoutPaymentCard | null>(null);
    const [loading, setLoading] = useState(false);
    const { user, token } = useAuthStore();
    const { buildReservationPayload, setPaymentCard, setPaymentResult, clearCheckout } = useCheckoutStore();

    const handleCardSelect = (card: CheckoutPaymentCard) => {
        setSelectedCard(card);
        setShowCardModal(false);
    };

    const handleInputChange = () => {
        setShowCardModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !token) {
            sileo.error({ title: "Debes iniciar sesión para pagar" });
            return;
        }

        if (!selectedCard) {
            sileo.error({ title: "Selecciona una tarjeta de prueba para continuar" });
            return;
        }

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const cardholderName = String(formData.get("cardholderName") || "").trim();

        if (!cardholderName) {
            sileo.error({ title: "Debes indicar el titular de la tarjeta" });
            return;
        }

        const reservationPayload = buildReservationPayload();
        if (!reservationPayload) {
            sileo.error({ title: "Faltan datos de la reserva. Vuelve a completar el proceso" });
            return;
        }

        setLoading(true);
        try {
            setPaymentCard({
                ...selectedCard,
                cardholderName,
            });

            const reservationResponse = await createReservation(reservationPayload, token);
            const paymentResponse = await verifyPayment({
                amount: reservationPayload.totalPrice,
                paymentMethodId: selectedCard.paymentMethodId,
                reservationId: String(reservationResponse.reservationId),
                email: user?.email || cardholderName,
            });

            setPaymentResult(reservationResponse.reservationId, paymentResponse.stripePaymentIntentId);
            sileo.success({
                title: "Pago completado y reserva generada",
            });
            clearCheckout();
        } catch (error: any) {
            sileo.error({
                title: "Error al procesar la reserva",
                description: error?.response?.data?.message || error?.message || "Error desconocido al procesar el pago",
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        selectedCard,
        setSelectedCard,
        handleCardSelect,
        handleInputChange,
        handleSubmit,
    };
}
