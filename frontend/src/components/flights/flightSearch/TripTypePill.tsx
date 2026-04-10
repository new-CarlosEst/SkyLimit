function TripTypePill(
    { name, active, onClick }: { name: string; active: boolean; onClick: () => void }
) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 cursor-pointer border-r border-blue-100 last:border-r-0
                ${active
                    ? "bg-[#2c5aa0] text-white"
                    : "bg-[#f4f6fb] text-gray-600 hover:bg-blue-50"
                }`}
        >
            {name}
        </button>
    );
}

export default TripTypePill;