import userIcon from "../../../assets/ui/ProiconsPerson.svg";

interface TextInputProps {
    label: string;
    name: string;
    placeholder: string;
    icon?: string;
    type?: string;
}

function TextInput({ label, name, placeholder, icon = userIcon, type = "text" }: TextInputProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={name} className="text-sm font-semibold text-gray-700">
                {label}
            </label>
            <div className="grid grid-cols-[auto_1fr] items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 sm:py-3.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all bg-white group hover:border-gray-400">
                <div className="flex items-center justify-center shrink-0">
                    <img src={icon} alt={label} className="w-5 h-5 opacity-40 group-focus-within:opacity-80 transition-opacity" />
                </div>
                <input
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    className="flex-1 min-w-0 outline-none bg-transparent text-gray-700 text-sm font-medium placeholder-gray-400"
                />
            </div>
        </div>
    )
}

export default TextInput;
