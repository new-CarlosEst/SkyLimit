import React, { useState, useRef, useEffect } from 'react';
import searchIcon from '../../assets/ui/text.svg'; // generic search icon placeholder

export interface SelectOption {
    value: string;
    label: string;
    badge?: string;    // short code shown in the pill (e.g. country ISO or 'M'/'F')
    subtitle?: string; // secondary line below the label
}

interface SearchableSelectProps {
    label: string;
    icon: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    required?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    label,
    icon,
    options,
    value,
    onChange,
    placeholder = 'Selecciona una opción...',
    searchPlaceholder = 'Buscar...',
    required = true,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = options.find(o => o.value === value) ?? null;

    const filtered = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        (o.badge ?? '').toLowerCase().includes(search.toLowerCase())
    );

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (opt: SelectOption) => {
        onChange(opt.value);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="input-container searchable-select-container" ref={containerRef}>
            <label className="input-label">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {/* Trigger */}
            <div
                className={`input-wrapper group cursor-pointer select-none ${isOpen ? 'border-blue-500 ring-4 ring-blue-100' : ''}`}
                onClick={() => setIsOpen(prev => !prev)}
            >
                <div className="input-icon-container">
                    <img src={icon} alt={label} className="input-icon" />
                </div>
                <span className={`input-field pointer-events-none ${selected ? 'text-gray-700' : 'text-gray-400'}`}>
                    {selected ? selected.label : placeholder}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="searchable-dropdown">
                    {/* Search bar */}
                    <div className="searchable-dropdown__search">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" strokeWidth="2" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="searchable-dropdown__search-input"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="searchable-dropdown__clear">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Options list */}
                    <ul className="searchable-dropdown__list">
                        {filtered.length === 0 ? (
                            <li className="searchable-dropdown__empty">Sin resultados</li>
                        ) : filtered.map(opt => (
                            <li
                                key={opt.value}
                                className={`searchable-dropdown__item ${opt.value === value ? 'searchable-dropdown__item--selected' : ''}`}
                                onClick={() => handleSelect(opt)}
                            >
                                {opt.badge && (
                                    <span className="searchable-dropdown__badge">{opt.badge}</span>
                                )}
                                <div className="searchable-dropdown__item-text">
                                    <span className="searchable-dropdown__item-label">{opt.label}</span>
                                    {opt.subtitle && (
                                        <span className="searchable-dropdown__item-subtitle">{opt.subtitle}</span>
                                    )}
                                </div>
                                {opt.value === value && (
                                    <svg className="w-4 h-4 text-[#2b5aa0] flex-shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
