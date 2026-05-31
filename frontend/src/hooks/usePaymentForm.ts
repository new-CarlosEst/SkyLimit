import { useState } from "react";
import { sileo } from "sileo";
import { createReservation } from "../api/reservation.api";
import { verifyPayment } from "../api/payment.api";
import type { CheckoutPaymentCard, CheckoutSavedPaymentCard } from "../types/checkout.types";

interface UsePaymentFormReturn {
    showCardModal: boolean;
    selectedCard: CheckoutPaymentCard | null;
    loading: boolean;
    handleCardSelect: (card: CheckoutPaymentCard) => void;
    handleInputChange: () => void;
    handleSubmit: (e: React.FormEvent, onSuccess: () => void) => void;
    setShowCardModal: (show: boolean) => void;
}

export function usePaymentForm(
    user: any,
    token: string | null,
    buildReservationPayload: () => any,
    setPaymentCard: (card: CheckoutSavedPaymentCard) => void,
    setPaymentResult: (reservationId: number, stripePaymentIntentId: string) => void,
    clearCheckout: () => void
): UsePaymentFormReturn {
    const [showCardModal, setShowCardModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CheckoutPaymentCard | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCardSelect = (card: CheckoutPaymentCard) => {
        setSelectedCard(card);
        setShowCardModal(false);
    };

    const handleInputChange = () => {
        setShowCardModal(true);
    };

    const handleSubmit = (e: React.FormEvent, onSuccess: () => void) => {
        e.preventDefault();
        void (async () => {
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
                const paymentCardWithHolder: CheckoutSavedPaymentCard = {
                    ...selectedCard,
                    cardholderName,
                };
                setPaymentCard(paymentCardWithHolder);

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
                onSuccess();
            } catch (error: any) {
                sileo.error({
                    title: "Error al procesar la reserva",
                    description: error?.response?.data?.message || error?.message || "Error desconocido al procesar el pago",
                });
            } finally {
                setLoading(false);
            }
        })();
    };

    return {
        showCardModal,
        selectedCard,
        loading,
        handleCardSelect,
        handleInputChange,
        handleSubmit,
        setShowCardModal,
    };
}
