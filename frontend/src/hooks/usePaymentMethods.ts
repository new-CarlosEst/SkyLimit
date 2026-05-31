import { useState, useEffect } from "react";
import { addPaymentMethod, getUserPaymentMethods, deletePaymentMethod } from "../api/payment.api";
import { sileo } from "sileo";
import { useAuthStore } from "../store/authStore";

export function usePaymentMethods() {
    const [isSaving, setIsSaving] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [isLoadingMethods, setIsLoadingMethods] = useState(false);
    const { user } = useAuthStore();

    const fetchPaymentMethods = async () => {
        if (!user?.id) {
            return;
        }

        setIsLoadingMethods(true);
        try {
            const response = await getUserPaymentMethods();
            setPaymentMethods(response.paymentMethods);
        } catch (error) {
            console.error("Error fetching payment methods:", error);
            // Don't show error toast if user is not authenticated
            if (user?.id) {
                sileo.error({ title: "Error al cargar los métodos de pago" });
            }
        } finally {
            setIsLoadingMethods(false);
        }
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, [user?.id]);

    const handleAddTestCard = async (cardId: string, card: any) => {
        setIsSaving(true);
        try {
            // Parse expiry to get month and year
            const [month, year] = card.expiry.split('/');
            const expirationDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1).toISOString();
            
            await addPaymentMethod({
                holderName: card.name,
                brand: card.brand,
                expirationDate,
                last4Digits: card.last4,
                stripePaymentMethodId: cardId,
            });
            
            sileo.success({ title: "Tarjeta agregada exitosamente" });
            await fetchPaymentMethods();
            return true;
        } catch (error) {
            console.error("Error adding payment method:", error);
            sileo.error({ title: "Error al agregar la tarjeta" });
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddCustomCard = async (cardData: {
        cardName: string;
        cardNumber: string;
        expiry: string;
    }) => {
        const { cardName, cardNumber, expiry } = cardData;
        
        if (!cardName || !cardNumber || !expiry) {
            sileo.error({ title: "Por favor completa todos los campos" });
            return false;
        }

        setIsSaving(true);
        try {
            // Parse expiry to get month and year
            const [month, year] = expiry.split('/');
            const expirationDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1).toISOString();
            
            // Detect brand from card number (simplified)
            let brand = 'unknown';
            if (cardNumber.startsWith('4')) brand = 'visa';
            else if (cardNumber.startsWith('5')) brand = 'mastercard';
            else if (cardNumber.startsWith('3')) brand = 'amex';

            await addPaymentMethod({
                holderName: cardName,
                brand,
                expirationDate,
                last4Digits: cardNumber.slice(-4),
                stripePaymentMethodId: 'pm_custom_' + Date.now(),
            });

            sileo.success({ title: "Tarjeta agregada exitosamente" });
            await fetchPaymentMethods();
            return true;
        } catch (error) {
            console.error("Error adding payment method:", error);
            sileo.error({ title: "Error al agregar la tarjeta" });
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePaymentMethod = async (paymentMethodId: number) => {
        try {
            await deletePaymentMethod(paymentMethodId);
            sileo.success({ title: "Tarjeta eliminada exitosamente" });
            await fetchPaymentMethods();
            return true;
        } catch (error) {
            console.error("Error deleting payment method:", error);
            sileo.error({ title: "Error al eliminar la tarjeta" });
            return false;
        }
    };

    return {
        isSaving,
        paymentMethods,
        isLoadingMethods,
        fetchPaymentMethods,
        handleAddTestCard,
        handleAddCustomCard,
        handleDeletePaymentMethod,
    };
}
