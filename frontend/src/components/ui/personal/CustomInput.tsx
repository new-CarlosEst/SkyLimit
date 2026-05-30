interface CustomInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    icon: string;
    options?: { value: string; label: string }[];
    required?: boolean;
}

function CustomInput({ label, name, type = "text", placeholder, icon, options, required = true }: CustomInputProps) {
    return (
        <div className="input-container">
            <label htmlFor={name} className="input-label">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="input-wrapper group">
                <div className="input-icon-container">
                    <img src={icon} alt={label} className="input-icon" />
                </div>
                {options ? (
                    <select name={name} id={name} required={required} defaultValue="" className="input-field">
                        <option value="" disabled>Selecciona una opción...</option>
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        required={required}
                        className="input-field"
                    />
                )}
            </div>
        </div>
    );
}

export default CustomInput;
