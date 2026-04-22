import { formatCabinClass } from "../../../utils/formaters";

function CabinTypeSelector(
    { active, name, onClick }: { active: boolean; name: string; onClick: () => void }
) {
    const id = `cabin-${name.toLowerCase().replace(/\s/g, "-")}`;

    return (
        <div
            onClick={onClick}
            className={`
                flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer flex-1
                ${active
                    ? "border-[#2c5aa0] bg-white shadow-sm"
                    : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                }
            `}
        >
            <input
                type="radio"
                name="cabinClass"
                id={id}
                checked={active}
                onChange={() => { }}
                className="hidden"
            />

            {/* Custom Radio Indicator */}
            <div className={`
                w-5 h-5 rounded-full flex items-center justify-center transition-all
                ${active
                    ? "border-2 border-[#2c5aa0]"
                    : "bg-[#4a5568]" // Dark gray solid circle for inactive
                }
            `}>
                {active && <div className="w-2.5 h-2.5 rounded-full bg-[#2c5aa0]" />}
            </div>

            <label htmlFor={id} className="text-sm font-semibold text-gray-800 cursor-pointer select-none">
                {formatCabinClass(name)}
            </label>
        </div>
    );
}

export default CabinTypeSelector;