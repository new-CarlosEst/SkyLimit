import { useState } from "react";
import CardSelector, { type Card } from "./CardSelector";
import { cards as stripeCards } from "../../../utils/cards";
import { usePaymentMethods } from "../../../hooks/usePaymentMethods";
import FamiconsCard from "../../../assets/ui/FamiconsCard.svg";
import MynauiX from "../../../assets/ui/MynauiX.svg";
import "./PaymentMethods.css";

const testCards: Card[] = stripeCards.map((card, index) => ({
    id: index.toString(),
    brand: card.brand,
    last4: card.number.slice(-4),
    expiry: `${card.expMonth}/${card.expYear.slice(-2)}`,
    name: `${card.brand} ${card.type === 'debit' ? 'Débito' : 'Crédito'}`
}));

function PaymentMethods() {
    const [selectedTestCard, setSelectedTestCard] = useState<string>("");
    const [showCardSelection, setShowCardSelection] = useState(false);
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const { isSaving, paymentMethods, isLoadingMethods, handleAddTestCard, handleAddCustomCard, handleDeletePaymentMethod } = usePaymentMethods();

    const handleCardSelect = async (cardId: string) => {
        const card = testCards.find(c => c.id === cardId);
        if (card) {
            const success = await handleAddTestCard(cardId, card);
            if (success) {
                setSelectedTestCard(cardId);
                setShowCardSelection(false);
                setShowCustomForm(false);
            }
        }
    };

    const handleAddCard = () => {
        setShowCardSelection(true);
        setShowCustomForm(false);
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(" ");
        } else {
            return v;
        }
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        if (v.length >= 2) {
            return v.substring(0, 2) + "/" + v.substring(2, 4);
        }
        return v;
    };

    const handleSaveCustomCard = async () => {
        const success = await handleAddCustomCard({ cardName, cardNumber, expiry });
        if (success) {
            setShowCustomForm(false);
            setCardNumber("");
            setCardName("");
            setExpiry("");
            setCvv("");
        }
    };

    return (
        <div className="card">
            <h2 className="card-title">Métodos de Pago</h2>
            
            {/* Saved payment methods */}
            {paymentMethods.length > 0 && (
                <div className="saved-payment-methods">
                    <h3 className="section-title">Tarjetas Guardadas</h3>
                    {isLoadingMethods ? (
                        <p className="loading-text">Cargando...</p>
                    ) : (
                        <div className="payment-methods-list">
                            {paymentMethods.map((method: any) => (
                                <div key={method.id} className="payment-method-card">
                                    <div className="payment-method-left">
                                        <img src={FamiconsCard} alt="Card" className="payment-method-icon" />
                                        <div className="payment-method-info">
                                            <span className="payment-method-brand">{method.brand}</span>
                                            <span className="payment-method-number">•••• {method.last4Digits}</span>
                                        </div>
                                    </div>
                                    <div className="payment-method-right">
                                        <span className="payment-method-expiry">
                                            Exp: {new Date(method.expirationDate).toLocaleDateString('es-ES', { month: '2-digit', year: '2-digit' })}
                                        </span>
                                        <button 
                                            className="delete-card-button"
                                            onClick={() => handleDeletePaymentMethod(method.id)}
                                            aria-label="Eliminar tarjeta"
                                        >
                                            <img src={MynauiX} alt="Eliminar" className="delete-icon" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="payment-section">
                <button
                    className="custom-card-button"
                    onClick={handleAddCard}
                >
                    + Agregar Nueva Tarjeta
                </button>

                {showCardSelection && (
                    <div className="card-selection-container">
                        <h3 className="section-title">Selecciona una tarjeta de prueba</h3>
                        <CardSelector
                            cards={testCards}
                            selectedCardId={selectedTestCard}
                            onCardSelect={handleCardSelect}
                        />
                    </div>
                )}

                {showCustomForm && (
                    <div className="custom-card-form">
                        <div className="form-group">
                            <label className="form-label">Nombre en la Tarjeta</label>
                            <input
                                type="text"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                className="form-input"
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Número de Tarjeta</label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                className="form-input"
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                            />
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Fecha de Expiración</label>
                                <input
                                    type="text"
                                    value={expiry}
                                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                    className="form-input"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">CVV</label>
                                <input
                                    type="text"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                                    className="form-input"
                                    placeholder="123"
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        <button 
                            className="submit-button"
                            onClick={handleSaveCustomCard}
                            disabled={isSaving}
                        >
                            {isSaving ? "Guardando..." : "Guardar Tarjeta"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentMethods;
