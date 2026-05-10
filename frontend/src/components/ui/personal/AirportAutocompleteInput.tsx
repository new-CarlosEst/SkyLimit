import { useState, useEffect, useRef, useCallback } from "react";
import type { Airport } from "../../../types/airport.types";
import { searchAirports } from "../../../api/flights.api";
import HugeiconsAirport from "../../../assets/ui/HugeiconsAirport.svg";

interface AirportAutocompleteInputProps {
    name: string;
    placeHolder: string;
    onAirportSelect?: (airport: Airport | null) => void;
    selectedAirport?: Airport | null;
}

function AirportAutocompleteInput({ name, placeHolder, onAirportSelect, selectedAirport }: AirportAutocompleteInputProps) {
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

    // Si hay un aeropuerto seleccionado, actualizamos el query
    useEffect(() => {
        if (selectedAirport) {
            setQuery(`${selectedAirport.city} (${selectedAirport.iata})`);
        } else {
            setQuery("");
        }
    }, [selectedAirport]);

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
        <div className="form-group">
            <label className="form-label">
                {name}
            </label>
            <div className="relative" ref={containerRef}>
                <div className={`flex items-center border border-gray-300 rounded-md transition-all duration-200
                    ${isOpen
                        ? "border-blue-500 ring-2 ring-blue-500/15 rounded-t-lg rounded-b-none"
                        : "border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15"
                    }`}
                >
                    <div className="p-2 border-r border-gray-300">
                        <img src={HugeiconsAirport} alt="Airport" className="w-5 h-5" />
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                        placeholder={placeHolder}
                        autoComplete="off"
                        className="flex-1 px-3 py-2 focus:outline-none"
                    />

                    {/* Spinner */}
                    {isLoading && (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2" />
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
                            className="text-gray-400 hover:text-gray-600 transition-colors mr-2"
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-t-0 border-blue-500 rounded-b-lg shadow-lg z-50 overflow-hidden">
                        {results.length === 0 && !isLoading ? (
                            <p className="px-4 py-3 text-sm text-gray-400 text-center">
                                No se encontraron aeropuertos
                            </p>
                        ) : (
                            <ul className="max-h-60 overflow-y-auto py-1">
                                {results.map((airport) => (
                                    <li
                                        key={airport.id}
                                        onMouseDown={(e) => { e.preventDefault(); handleSelect(airport); }}
                                        className="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors"
                                    >
                                        {/* Badge IATA */}
                                        <span className="inline-flex items-center justify-center min-w-[42px] px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-md tracking-wide">
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
        </div>
    );
}

export default AirportAutocompleteInput;
