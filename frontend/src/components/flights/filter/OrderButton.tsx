import { useState } from "react";
import upDownArrow from "../../../assets/ui/upDownArrow.svg";
import upArrow from "../../../assets/ui/FlowbiteArrowUpOutline.svg";
import downArrow from "../../../assets/ui/FlowbiteArrowDownOutline.svg";
import { useFlightSearchStore } from "../../../store/flightSearchStore";

interface OrderOption {
    label: string;
    value: 'price' | 'duration' | 'stops' | 'departure' | 'arrival';
}

const orderOptions: OrderOption[] = [
    { label: "Precio", value: "price" },
    { label: "Duración", value: "duration" },
    { label: "Número de escalas", value: "stops" },
    { label: "Hora de salida", value: "departure" },
    { label: "Hora de llegada", value: "arrival" },
];

function OrderButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { sortBy, sortDirection, setSortBy } = useFlightSearchStore();

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
                <img src={upDownArrow} alt="Ordenar" className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">
                    {sortBy ? orderOptions.find(opt => opt.value === sortBy)?.label : "Ordenar"}
                </span>
                {sortBy && (
                    <img 
                        src={sortDirection === 'asc' ? upArrow : downArrow} 
                        alt={sortDirection === 'asc' ? 'Ascendente' : 'Descendente'} 
                        className="w-4 h-4 text-gray-700" 
                    />
                )}
            </button>
            
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px]">
                        {orderOptions.map((option, index) => (
                            <button
                                key={option.value}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm flex items-center justify-between ${
                                    index === 0 ? 'rounded-t-lg border-b border-gray-100' : 
                                    index === orderOptions.length - 1 ? 'rounded-b-lg' : 
                                    'border-b border-gray-100'
                                }`}
                                onClick={() => {
                                    setSortBy(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{option.label}</span>
                                {sortBy === option.value && (
                                    <img 
                                        src={sortDirection === 'asc' ? upArrow : downArrow} 
                                        alt={sortDirection === 'asc' ? 'Ascendente' : 'Descendente'} 
                                        className="w-4 h-4 text-gray-700" 
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default OrderButton;