import { useState, useMemo } from "react";
import pointRightArrow from "../../../assets/ui/pointRightArrow.svg";
import { useFlightSearchStore } from "../../../store/flightSearchStore";
import { useFilterStore } from "../../../store/filterStore";
import usePriceSlider from "../../../hooks/usePriceSlider";
import { useDurationFilters } from "../../../hooks/useDurationFilters";
import { DurationFilterSection } from "./DurationFilterSection";
import "./FilterSidebar.css";

function FilterSidebar({ tripType }: { tripType: "oneWay" | "roundTrip" | "multi" | null }) {
    const [isOpen, setIsOpen] = useState(true);
    const { priceRange, sliderValue, handlePriceChange } = usePriceSlider(20000);
    
    // Estado local para los filtros (no se aplican hasta hacer clic en "Aplicar")
    const [localStops, setLocalStops] = useState("");
    const [localAirlines, setLocalAirlines] = useState<string[]>([]);
    const [localPriceRange, setLocalPriceRange] = useState({ min: 0, max: 20000 });
    
    // Usar hook personalizado para filtros de duración
    const {
        localDurationFilters,
        setLocalDurationFilters,
        expandedSections,
        durationOptions,
        toggleSection,
        updateDurationFilter,
        getChevronIcon
    } = useDurationFilters({ tripType });
    
    const { 
        duration: _duration, 
        stops: _stops, 
        airlines: _airlines, 
        setDuration, 
        setStops, 
        setAirlines, 
        setPriceRange
    } = useFilterStore();
    const { results } = useFlightSearchStore();

    const toggleFilter = () => {
        setIsOpen(!isOpen);
    };

    const uniqueAirlines = useMemo(() => {
        if (!results || results.length === 0) return [];
        const airlines = new Set<string>();
        results.forEach((flight) => {
            flight.legs.forEach((leg) => {
                leg.carriers.forEach((carrier) => {
                    airlines.add(carrier.name);
                });
            });
        });
        return Array.from(airlines).sort();
    }, [results]);

    // Contador de filtros activos
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        
        // Contar filtros de duración
        if (typeof localDurationFilters === 'object') {
            count += Object.values(localDurationFilters).filter(filter => filter !== "").length;
        }
        
        // Contar filtro de escalas
        if (localStops !== "") count++;
        
        // Contar aerolíneas seleccionadas
        count += localAirlines.length;
        
        // Contar filtro de precio (si no está en el rango por defecto)
        if (localPriceRange.min !== 0 || localPriceRange.max !== 20000) count++;
        
        return count;
    }, [localDurationFilters, localStops, localAirlines, localPriceRange]);

    return (
        <div className={`filter-wrapper ${isOpen ? "open" : "closed"}`}>
            <button className="toggle-button" onClick={toggleFilter}>
                <img src={pointRightArrow} alt="toggle" className="toggle-arrow" />
                <span className="toggle-tooltip">{isOpen ? "Ocultar filtros" : "Mostrar filtros"}</span>
            </button>
            <div className={`filter-sidebar ${isOpen ? "open" : "closed"} border border-gray-100 shadow-lg`}>
                <div className="filter-content">
                    <div className="filter-header">
                        <h3 className="filter-title">Filtros</h3>
                        {activeFiltersCount > 0 && (
                            <div className="filter-badge">{activeFiltersCount}</div>
                        )}
                    </div>
                    <div className="filter-section">
                        <label className="filter-label">Precio</label>
                        <div className="price-range">
                            <div className="price-values">
                                <span>€{priceRange.min}</span>
                                <span>€{priceRange.max}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={sliderValue}
                                step="1"
                                onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    handlePriceChange(newValue);
                    setLocalPriceRange({ min: 0, max: priceRange.max });
                }}
                                className="price-slider"
                            />
                        </div>
                    </div>
                    <DurationFilterSection 
                        tripType={tripType}
                        localDurationFilters={localDurationFilters}
                        setLocalDurationFilters={setLocalDurationFilters}
                        expandedSections={expandedSections}
                        durationOptions={durationOptions}
                        toggleSection={toggleSection}
                        updateDurationFilter={updateDurationFilter}
                        getChevronIcon={getChevronIcon}
                    />
                    <div className="filter-section">
                        <label className="filter-label">Escalas</label>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input type="checkbox" checked={localStops === "direct"} onChange={() => setLocalStops(localStops === "direct" ? "" : "direct")} />
                                <span>Directo</span>
                            </label>
                            <label className="filter-option">
                                <input type="checkbox" checked={localStops === "one-stop"} onChange={() => setLocalStops(localStops === "one-stop" ? "" : "one-stop")} />
                                <span>1 escala</span>
                            </label>
                            <label className="filter-option">
                                <input type="checkbox" checked={localStops === "multi-stop"} onChange={() => setLocalStops(localStops === "multi-stop" ? "" : "multi-stop")} />
                                <span>2 o más escalas</span>
                            </label>
                        </div>
                    </div>
                    <div className="filter-section">
                        <label className="filter-label">Aerolíneas</label>
                        <div className="filter-options">
                            {uniqueAirlines.map((airline) => (
                                <label key={airline} className="filter-option">
                                    <input type="checkbox" checked={localAirlines.includes(airline)} onChange={(e) => {
                                        if (e.target.checked) {
                                            setLocalAirlines([...localAirlines, airline]);
                                        } else {
                                            setLocalAirlines(localAirlines.filter((a: string) => a !== airline));
                                        }
                                    }} />
                                    <span>{airline}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button 
                        className="apply-filters-button"
                        onClick={() => {
                            console.log('Applying filters:', {
                                durationFilters: localDurationFilters,
                                stops: localStops,
                                airlines: localAirlines,
                                priceRange: localPriceRange
                            });
                            setDuration(localDurationFilters as any);
                            setStops(localStops as any);
                            setAirlines(localAirlines);
                            setPriceRange(localPriceRange);
                        }}
                    >
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FilterSidebar;
