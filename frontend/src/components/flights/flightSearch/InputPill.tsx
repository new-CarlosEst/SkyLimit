function InputPill({
    name,
    icon,
    placeHolder,
    inputType,
}: {
    name: string;
    icon: string;
    placeHolder: string;
    inputType: string;
}) {
    return (
        <div className="flex flex-col gap-1 text-left">
            <label htmlFor={name} className="text-sm font-semibold text-gray-600 tracking-wide">
                {name}
            </label>
            <div className="flex items-center gap-2 border border-[#d1daf0] rounded-xl px-3 py-2.5 bg-white transition-all duration-200 focus-within:border-[#2c5aa0] focus-within:ring-2 focus-within:ring-[#2c5aa0]/15">
                {icon && (
                    <img src={icon} alt={`${name}-icon`} className="w-[18px] h-[18px] opacity-50 shrink-0" />
                )}
                <input
                    id={name}
                    type={inputType}
                    name={name}
                    placeholder={placeHolder}
                    className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
                />
            </div>
        </div>
    );
}

export default InputPill;