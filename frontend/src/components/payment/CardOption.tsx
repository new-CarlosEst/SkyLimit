interface CardOptionProps {
    brand: string;
    number: string;
    type: string;
    onClick: () => void;
}

function CardOption({ brand, number, type, onClick }: CardOptionProps) {
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
        <div
            onClick={onClick}
            className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer transition-all hover:border-[#2b5aa0] hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md mb-3"
        >
            <div className="shrink-0">
                {getCardIcon(brand)}
            </div>
            <div className="flex-1">
                <p className="text-base font-semibold text-slate-800 mb-1">{brand}</p>
                <p className="text-sm text-slate-600 mb-1">Terminada en {number.slice(-4)}</p>
                <p className="text-xs text-[#2b5aa0] font-medium uppercase tracking-wider">
                    {type === 'credit' ? 'Crédito' : 'Débito'}
                </p>
            </div>
        </div>
    );
}

export default CardOption;
