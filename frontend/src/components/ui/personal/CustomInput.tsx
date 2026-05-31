interface CustomInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    icon: string;
    options?: { value: string; label: string }[];
    required?: boolean;
}

function CustomInput({ label, name, type = "text", placeholder, icon, options, required = false }: CustomInputProps) {
    return (
        <div className="passenger-input-container">
            <label htmlFor={name} className="passenger-input-label">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="passenger-input-wrapper group">
                <div className="passenger-input-icon-container">
                    <img src={icon} alt={label} className="passenger-input-icon" />
                </div>
                {options ? (
                    <select name={name} id={name} required={required} defaultValue="" className="passenger-input-field">
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
                        className="passenger-input-field"
                    />
                )}
            </div>
        </div>
    );
}

export default CustomInput;
