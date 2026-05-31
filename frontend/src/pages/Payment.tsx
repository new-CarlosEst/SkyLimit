import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CardSelectorModal from "../components/payment/CardSelectorModal";
import { createReservation } from "../api/reservation.api";
import { verifyPayment } from "../api/payment.api";
import { useAuthStore } from "../store/authStore";
import { useCheckoutStore } from "../store/checkoutStore";
import type { CheckoutPaymentCard } from "../types/checkout.types";
import { sileo } from "sileo";
import "./Payment.css";

// Icons
import personIcon from "../assets/ui/ProiconsPerson.svg";
import cardIcon from "../assets/ui/FamiconsCard.svg";


function Payment() {
    const navigate = useNavigate();
    const [showCardModal, setShowCardModal] = useState(false);
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

    const handleSubmit = (e: React.FormEvent) => {
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
                setPaymentCard({
                    ...selectedCard,
                    cardholderName,
                });

                const reservationResponse = await createReservation(reservationPayload, token);
                const paymentResponse = await verifyPayment({
                    amount: reservationPayload.totalPrice,
                    paymentMethodId: selectedCard.paymentMethodId,
                    reservationId: String(reservationResponse.reservationId),
                    userId: String(user.id),
                    cardholderName,
                });

                setPaymentResult(reservationResponse.reservationId, paymentResponse.stripePaymentIntentId);
                sileo.success({
                    title: "Pago completado y reserva generada",
                });
                clearCheckout();
                navigate("/");
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

    const getCardIcon = (brand: string) => {
        switch (brand.toLowerCase()) {
            case 'visa':
                return (
                    <svg viewBox="0 0 24 24" className="w-8 h-5">
                        <path fill="#1A1F71" d="M9.5 6.5L7.5 17.5H10L12 6.5H9.5Z"/>
                        <path fill="#1A1F71" d="M16.5 6.5L14 14L13.5 11.5L12.5 8C12.5 8 12 6.5 10 6.5H6L6 6.7C6 6.7 8.5 7.2 11.5 8.5L14 17.5H16.5L21 6.5H16.5Z"/>
                    </svg>
                );
            case 'mastercard':
                return (
                    <svg viewBox="0 0 24 24" className="w-8 h-5">
                        <circle cx="9" cy="12" r="6" fill="#EB001B"/>
                        <circle cx="15" cy="12" r="6" fill="#F79E1B"/>
                        <path fill="#FF5F00" d="M12 7.5C13.8 8.8 15 10.8 15 12C15 13.2 13.8 15.2 12 16.5C10.2 15.2 9 13.2 9 12C9 10.8 10.2 8.8 12 7.5Z"/>
                    </svg>
                );
            default:
                return (
                    <svg viewBox="0 0 24 24" className="w-8 h-5">
                        <rect x="2" y="5" width="20" height="14" rx="2" fill="#6B7280"/>
                        <line x1="2" y1="10" x2="22" y2="10" stroke="#9CA3AF" strokeWidth="1"/>
                    </svg>
                );
        }
    };

    return (
        <div className="payment-container">
            <div className="payment-content">
                <div className="mb-6 flex">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-[#2b5aa0] hover:bg-[#1a3c79] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                    >
                        <span className="text-xl leading-none mb-0.5">←</span>
                        <span>Volver atrás</span>
                    </button>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Pago</h1>
                    <p className="text-slate-600">Completa los datos de pago para finalizar tu reserva.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Datos personales */}
                    <div className="payment-card">
                        <div className="payment-card-header">
                            <h2 className="payment-card-title">Datos Personales</h2>
                        </div>
                        <div className="form-grid">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="cardholderName" className="text-sm font-semibold text-slate-700">
                                    Titular de la tarjeta <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-3 border border-slate-300 rounded-lg p-3 bg-white transition-all focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_#dbeafe] hover:not-focus-within:border-slate-400">
                                    <div className="flex items-center justify-center shrink-0 w-5 h-5 overflow-hidden">
                                        <img src={personIcon} alt="Titular" className="w-5 h-5 min-w-5 opacity-40 transition-opacity focus-within:opacity-80" />
                                    </div>
                                    <input
                                        type="text"
                                        id="cardholderName"
                                        name="cardholderName"
                                        placeholder="Nombre como aparece en la tarjeta"
                                        required
                                        className="flex-1 min-w-0 outline-none bg-transparent text-slate-700 text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Datos de la tarjeta */}
                    <div className="payment-card">
                        <div className="payment-card-header">
                            <h2 className="payment-card-title">Datos de la Tarjeta</h2>
                        </div>
                        <div className="form-grid">
                            {/* Número de tarjeta */}
                            <div className="flex flex-col gap-1 col-span-full">
                                <label htmlFor="cardNumber" className="text-sm font-semibold text-slate-700">
                                    Número de tarjeta <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-3 border border-slate-300 rounded-lg p-3 bg-white transition-all focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_#dbeafe] hover:not-focus-within:border-slate-400">
                                    <div className="flex items-center justify-center shrink-0 w-5 h-5 overflow-hidden">
                                        <img src={cardIcon} alt="Tarjeta" className="w-5 h-5 min-w-5 opacity-40 transition-opacity focus-within:opacity-80" />
                                    </div>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        name="cardNumber"
                                        placeholder="•••• •••• •••• ••••"
                                        required
                                        className="flex-1 min-w-0 outline-none bg-slate-50 text-slate-700 text-sm font-medium cursor-pointer"
                                        value={selectedCard ? selectedCard.number.replace(/(\d{4})/g, '$1 ').trim() : ''}
                                        readOnly
                                        onClick={handleInputChange}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Haz clic para seleccionar una tarjeta de prueba</p>
                            </div>

                            {/* CVC */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="cvc" className="text-sm font-semibold text-slate-700">
                                    CVC <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-3 border border-slate-300 rounded-lg p-3 bg-white transition-all focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_#dbeafe] hover:not-focus-within:border-slate-400">
                                    <div className="flex items-center justify-center shrink-0 w-5 h-5 overflow-hidden">
                                        <img src={cardIcon} alt="CVC" className="w-5 h-5 min-w-5 opacity-40 transition-opacity focus-within:opacity-80" />
                                    </div>
                                    <input
                                        type="text"
                                        id="cvc"
                                        name="cvc"
                                        placeholder="•••"
                                        required
                                        className="flex-1 min-w-0 outline-none bg-slate-50 text-slate-700 text-sm font-medium cursor-pointer"
                                        value={selectedCard ? selectedCard.cvc : ''}
                                        readOnly
                                        onClick={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Fecha de expiración */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="expiration" className="text-sm font-semibold text-slate-700">
                                    Fecha de expiración <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-[auto_1fr] items-center gap-3 border border-slate-300 rounded-lg p-3 bg-white transition-all focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_#dbeafe] hover:not-focus-within:border-slate-400">
                                    <div className="flex items-center justify-center shrink-0 w-5 h-5 overflow-hidden">
                                        <img src={cardIcon} alt="Expiración" className="w-5 h-5 min-w-5 opacity-40 transition-opacity focus-within:opacity-80" />
                                    </div>
                                    <input
                                        type="text"
                                        id="expiration"
                                        name="expiration"
                                        placeholder="MM/AA"
                                        required
                                        className="flex-1 min-w-0 outline-none bg-slate-50 text-slate-700 text-sm font-medium cursor-pointer"
                                        value={selectedCard ? `${selectedCard.expMonth}/${selectedCard.expYear.slice(-2)}` : ''}
                                        readOnly
                                        onClick={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información de la tarjeta seleccionada */}
                        {selectedCard && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-3">
                                    {getCardIcon(selectedCard.brand)}
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {selectedCard.brand} terminada en {selectedCard.number.slice(-4)}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {selectedCard.type === 'credit' ? 'Crédito' : 'Débito'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end mt-8 mb-12">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#2b5aa0] hover:bg-[#1a3c79] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md transition-colors"
                        >
                            {loading ? "Procesando..." : "Pagar Ahora"}
                        </button>
                    </div>
                </form>

                {/* Modal de selección de tarjetas */}
                <CardSelectorModal
                    isOpen={showCardModal}
                    onClose={() => setShowCardModal(false)}
                    onCardSelect={handleCardSelect}
                />
            </div>
        </div>
    );
}

export default Payment;
