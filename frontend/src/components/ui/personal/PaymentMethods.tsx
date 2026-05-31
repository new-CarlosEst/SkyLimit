import { useState } from "react";
import CardSelector, { type Card } from "./CardSelector";
import { cards as stripeCards } from "../../../utils/cards";
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

    const handleCardSelect = (cardId: string) => {
        setSelectedTestCard(cardId);
        setShowCardSelection(false);
        setShowCustomForm(false);
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

    return (
        <div className="card">
            <h2 className="card-title">Métodos de Pago</h2>
            
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

                        <button className="submit-button">
                            Guardar Tarjeta
                        </button>
                    </div>
                )}
            </div>

            {selectedTestCard && (
                <div className="selected-card-info">
                    <p className="text-sm text-gray-600">
                        Tarjeta seleccionada: <strong>{testCards.find(c => c.id === selectedTestCard)?.brand}</strong> terminada en <strong>{testCards.find(c => c.id === selectedTestCard)?.last4}</strong>
                    </p>
                </div>
            )}
        </div>
    );
}

export default PaymentMethods;
