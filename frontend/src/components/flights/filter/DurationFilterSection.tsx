import type { DurationFilters } from "../../../hooks/useDurationFilters";

//Filtro para la duracion
interface DurationFilterSectionProps {
    tripType: "oneWay" | "roundTrip" | "multi" | null;
    localDurationFilters: DurationFilters;
    setLocalDurationFilters: (filters: DurationFilters) => void;
    expandedSections: {[key: string]: boolean};
    durationOptions: Array<{ value: string; label: string }>;
    toggleSection: (section: string) => void;
    updateDurationFilter: (leg: string, value: string) => void;
    getChevronIcon: (isExpanded: boolean) => string;
}

export function DurationFilterSection({
    tripType,
    localDurationFilters,
    setLocalDurationFilters,
    expandedSections,
    durationOptions,
    toggleSection,
    updateDurationFilter,
    getChevronIcon
}: DurationFilterSectionProps) {
    // Renderizar según tipo de viaje
    if (tripType === "oneWay") {
        return (
            <div className="filter-section">
                <label className="filter-label">Duración</label>
                <div className="filter-options">
                    {durationOptions.map(option => (
                        <label key={option.value} className="filter-option">
                            <input 
                                type="checkbox" 
                                checked={localDurationFilters["outbound"] === option.value}
                                onChange={() => updateDurationFilter("outbound", option.value)}
                            />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    if (tripType === "roundTrip") {
        return (
            <div className="filter-section">
                <label className="filter-label">Duración</label>
                
                {/* Ida */}
                <div className="duration-leg-section">
                    <div 
                        className="duration-leg-header"
                        onClick={() => toggleSection("outbound")}
                    >
                        <span className="leg-label">Ida</span>
                        <img 
                            src={getChevronIcon(expandedSections["outbound"])} 
                            alt="Toggle" 
                            className="dropdown-chevron"
                        />
                    </div>
                    {expandedSections["outbound"] && (
                        <div className="filter-options">
                            {durationOptions.map(option => (
                                <label key={`outbound-${option.value}`} className="filter-option">
                                    <input 
                                        type="checkbox" 
                                        checked={localDurationFilters["outbound"] === option.value}
                                        onChange={() => updateDurationFilter("outbound", option.value)}
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Vuelta */}
                <div className="duration-leg-section">
                    <div 
                        className="duration-leg-header"
                        onClick={() => toggleSection("return")}
                    >
                        <span className="leg-label">Vuelta</span>
                        <img 
                            src={getChevronIcon(expandedSections["return"])} 
                            alt="Toggle" 
                            className="dropdown-chevron"
                        />
                    </div>
                    {expandedSections["return"] && (
                        <div className="filter-options">
                            {durationOptions.map(option => (
                                <label key={`return-${option.value}`} className="filter-option">
                                    <input 
                                        type="checkbox" 
                                        checked={localDurationFilters["return"] === option.value}
                                        onChange={() => updateDurationFilter("return", option.value)}
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (tripType === "multi") {
        // Para múltiples destinos, necesitamos saber cuántos legs hay
        // Por ahora, mostraremos 3 vuelos como ejemplo
        const multiLegs = ["vuelo1", "vuelo2", "vuelo3"];
        
        return (
            <div className="filter-section">
                <label className="filter-label">Duración</label>
                {multiLegs.map(leg => (
                    <div key={leg} className="duration-leg-section">
                        <div 
                            className="duration-leg-header"
                            onClick={() => toggleSection(leg)}
                        >
                            <span className="leg-label">{leg === "vuelo1" ? "Vuelo 1" : leg === "vuelo2" ? "Vuelo 2" : "Vuelo 3"}</span>
                            <img 
                                src={getChevronIcon(expandedSections[leg])} 
                                alt="Toggle" 
                                className="dropdown-chevron inline-chevron"
                            />
                        </div>
                        {expandedSections[leg] && (
                            <div className="filter-options">
                                {durationOptions.map(option => (
                                    <label key={`${leg}-${option.value}`} className="filter-option">
                                        <input 
                                            type="checkbox" 
                                            checked={localDurationFilters[leg] === option.value}
                                            onChange={() => updateDurationFilter(leg, option.value)}
                                        />
                                        <span>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return null;
}
