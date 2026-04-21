import { useState, useEffect, useRef, useCallback } from "react";
import type { Airport } from "../../../types/airport.types";
import { searchAirports } from "../../../api/flights.api";

interface AirportInputProps {
    name: string;
    icon: string;
    placeHolder: string;
    onAirportSelect?: (airport: Airport | null) => void;
}
//TODO: Ver como funciona y entenderlo
function AirportInput({ name, icon, placeHolder, onAirportSelect }: AirportInputProps) {
    // Texto que escribe el usuario
    const [query, setQuery] = useState("");
    // Resultados de la API
    const [results, setResults] = useState<Airport[]>([]);
    // Visibilidad del dropdown
    const [isOpen, setIsOpen] = useState(false);
    // Estado de carga
    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchAirports = useCallback(async (searchText: string) => {
        if (searchText.trim().length === 0) {
            setResults([]);
            setIsOpen(false);
            return;
        }
        setIsLoading(true);
        try {
            const data = await searchAirports(searchText);
            setResults(data);
            setIsOpen(true);
        } catch {
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onAirportSelect?.(null);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (value.trim().length === 0) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        debounceTimer.current = setTimeout(() => fetchAirports(value), 300);
    };

    const handleSelect = (airport: Airport) => {
        setQuery(`${airport.city} (${airport.iata})`);
        setResults([]);
        setIsOpen(false);
        onAirportSelect?.(airport);
    };

    // Cierra el dropdown si se hace click fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Limpia el timer al desmontar
    useEffect(() => {
        return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
    }, []);

    return (
        <div className="relative flex flex-col gap-1 text-left" ref={containerRef}>

            {/* Label */}
            <label htmlFor={name} className="text-sm font-semibold text-gray-600 tracking-wide">
                {name}
            </label>

            {/* Campo de input */}
            <div className={`flex items-center gap-2 border bg-white px-3 py-2.5 transition-all duration-200
                ${isOpen
                    ? "border-[#2c5aa0] ring-2 ring-[#2c5aa0]/15 rounded-t-xl rounded-b-none"
                    : "border-[#d1daf0] rounded-xl focus-within:border-[#2c5aa0] focus-within:ring-2 focus-within:ring-[#2c5aa0]/15"
                }`}
            >
                {icon && (
                    <img src={icon} alt={`${name}-icon`} className="w-[18px] h-[18px] opacity-50 shrink-0" />
                )}

                <input
                    id={name}
                    type="text"
                    name={name}
                    value={query}
                    onChange={handleChange}
                    onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                    placeholder={placeHolder}
                    autoComplete="off"
                    className="flex-1 min-w-0 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
                />

                {/* Spinner */}
                {isLoading && (
                    <div className="w-4 h-4 border-2 border-[#d1daf0] border-t-[#2c5aa0] rounded-full animate-spin shrink-0" />
                )}

                {/* Botón limpiar */}
                {query && !isLoading && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                            setIsOpen(false);
                            onAirportSelect?.(null);
                        }}
                        aria-label="Limpiar"
                        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-t-0 border-[#2c5aa0] rounded-b-xl shadow-lg z-50 overflow-hidden animate-[fadeDown_0.15s_ease-out]">
                    {results.length === 0 && !isLoading ? (
                        <p className="px-4 py-3 text-sm text-gray-400 text-center">
                            No se encontraron aeropuertos
                        </p>
                    ) : (
                        <ul className="max-h-60 overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#d1daf0] [&::-webkit-scrollbar-thumb]:rounded">
                            {results.map((airport) => (
                                <li
                                    key={airport.id}
                                    onMouseDown={(e) => { e.preventDefault(); handleSelect(airport); }}
                                    className="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors"
                                >
                                    {/* Badge IATA */}
                                    <span className="inline-flex items-center justify-center min-w-[42px] px-1.5 py-0.5 bg-[#e8f0fe] text-[#2c5aa0] text-xs font-bold rounded-md tracking-wide shrink-0">
                                        {airport.iata}
                                    </span>

                                    {/* Info */}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-semibold text-gray-800 truncate">
                                            {airport.city}
                                        </span>
                                        <span className="text-xs text-gray-500 truncate">
                                            {airport.name} · {airport.country}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default AirportInput;
