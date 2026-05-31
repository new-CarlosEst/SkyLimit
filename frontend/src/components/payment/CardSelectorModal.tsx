import { cards } from "../../utils/cards";
import CardOption from "./CardOption";
import type { CheckoutPaymentCard } from "../../types/checkout.types";

interface CardSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCardSelect: (card: CheckoutPaymentCard) => void;
}

function CardSelectorModal({ isOpen, onClose, onCardSelect }: CardSelectorModalProps) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-[#2b5aa0]">
                        Selecciona una tarjeta de prueba
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl text-slate-500 hover:text-slate-700 transition-colors p-2"
                    >
                        ✕
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
                    {cards.map((card, index) => (
                        <CardOption
                            key={index}
                            brand={card.brand}
                            number={card.number}
                            type={card.type}
                            onClick={() => onCardSelect(card)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CardSelectorModal;
