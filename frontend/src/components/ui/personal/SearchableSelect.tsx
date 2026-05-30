import { useState, useRef, useEffect } from 'react';
import { COUNTRIES } from '../../../data/countries';

interface SearchableSelectProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    useCountries?: boolean;
}

function SearchableSelect({ 
    label, 
    name, 
    value, 
    onChange, 
    placeholder = "Selecciona una opción...", 
    icon, 
    required = true,
    options,
    useCountries = false
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectOptions = useCountries 
        ? COUNTRIES.map(c => ({ value: c.code, label: c.name }))
        : options || [];

    const filteredOptions = selectOptions.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = selectOptions.find(opt => opt.value === value);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleClear = () => {
        onChange('');
        setSearchTerm('');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-2 w-full" ref={dropdownRef}>
            <label htmlFor={name} className="text-sm font-semibold text-gray-700">
                {label} {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div
                className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 p-3.5 bg-white border-[1.5px] border-gray-200 rounded-xl cursor-pointer transition-all duration-200 relative hover:border-gray-300 hover:shadow-sm ${isOpen ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-center shrink-0 w-5 h-5">
                    <img src={icon} alt={label} className="w-5 h-5 opacity-50 transition-opacity hover:opacity-80" />
                </div>
                <div className="flex-1 min-w-0 text-sm font-medium text-gray-700">
                    {selectedOption ? selectedOption.label : <span className="text-gray-400">{placeholder}</span>}
                </div>
                <div className={`flex items-center justify-center shrink-0 text-gray-400 transition-all duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                {selectedOption && (
                    <button
                        type="button"
                        className="flex items-center justify-center shrink-0 w-5 h-5 bg-gray-100 border-none rounded text-gray-500 cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:text-gray-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClear();
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                )}

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-[1.5px] border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2 p-2 border-b border-gray-100 bg-gray-50">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-gray-400">
                            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 border-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                            autoFocus
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                className="flex items-center justify-center shrink-0 w-4 h-4 bg-gray-200 border-none rounded text-gray-500 cursor-pointer transition-all duration-150 hover:bg-gray-300 hover:text-gray-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchTerm('');
                                }}
                            >
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className="max-h-40 overflow-y-auto p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-400">No hay resultados</div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all duration-150 text-sm ${value === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                                    onClick={() => handleSelect(opt.value)}
                                >
                                    {useCountries && (
                                        <span className="shrink-0 bg-blue-100 text-blue-700 text-xs font-semibold px-1 py-0.5 rounded tracking-wider">{opt.value}</span>
                                    )}
                                    <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{opt.label}</span>
                                    {value === opt.value && (
                                        <svg className="shrink-0 text-blue-700" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 8L6 11L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

export default SearchableSelect;
