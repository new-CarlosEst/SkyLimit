interface SeatProps {
    row: number;
    label: string;
    price?: number;
    isSelected: boolean;
    isOccupied?: boolean;
    isXL?: boolean;
    isLarge?: boolean;
    onSelect: () => void;
}

function Seat({ 
    row, 
    label, 
    price, 
    isSelected, 
    isOccupied = false, 
    isXL = false, 
    isLarge = false,
    onSelect 
}: SeatProps) {
    const baseClasses = "relative rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center font-medium";
    
    let sizeClasses = isLarge 
        ? "w-16 h-16 text-sm" 
        : "w-12 h-12 text-xs";
    
    let colorClasses = "";
    let priceDisplay = "";
    
    if (isOccupied) {
        colorClasses = "bg-gray-200 text-gray-400 cursor-not-allowed";
    } else if (isSelected) {
        colorClasses = "bg-blue-600 text-white";
    } else if (isXL) {
        colorClasses = "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300";
        priceDisplay = `+${price}€`;
    } else if (price && price > 0) {
        colorClasses = "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300";
        priceDisplay = `+${price}€`;
    } else {
        colorClasses = "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300";
    }

    return (
        <button
            type="button"
            className={`${baseClasses} ${sizeClasses} ${colorClasses}`}
            onClick={onSelect}
            disabled={isOccupied}
            title={`${label} - Fila ${row}${price ? ` (+${price}€)` : ''}`}
        >
            <span className="font-bold">{label}</span>
            {priceDisplay && (
                <span className="text-[10px] mt-0.5">{priceDisplay}</span>
            )}
        </button>
    );
}

export default Seat;
