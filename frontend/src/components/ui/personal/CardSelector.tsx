import FamiconsCard from "../../../assets/ui/FamiconsCard.svg";

export interface Card {
    id: string;
    brand: string;
    last4: string;
    expiry: string;
    name: string;
}

interface CardSelectorProps {
    cards: Card[];
    selectedCardId: string;
    onCardSelect: (cardId: string) => void;
}

function CardSelector({ cards, selectedCardId, onCardSelect }: CardSelectorProps) {
    return (
        <div className="cards-grid">
            {cards.map((card) => (
                <div
                    key={card.id}
                    className={`card-option ${selectedCardId === card.id ? "selected" : ""}`}
                    onClick={() => onCardSelect(card.id)}
                >
                    <div className="card-header">
                        <img src={FamiconsCard} alt="Card" className="card-icon" />
                        <span className="card-brand">{card.brand}</span>
                    </div>
                    <div className="card-details">
                        <p className="card-number">•••• •••• •••• {card.last4}</p>
                        <p className="card-expiry">Expira: {card.expiry}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CardSelector;
