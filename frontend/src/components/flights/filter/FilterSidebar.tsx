import { useState, useMemo } from "react";
import pointRightArrow from "../../../assets/ui/pointRightArrow.svg";
import { useFlightSearchStore } from "../../../store/flightSearchStore";
import usePriceSlider from "../../../hooks/usePriceSlider";
import "./FilterSidebar.css";

function FilterSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { priceRange, sliderValue, handlePriceChange } = usePriceSlider(20000);
    const [selectedDuration, setSelectedDuration] = useState("");
    const [selectedStop, setSelectedStop] = useState("");
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
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
        return Array.from(airlines);
    }, [results]);

    // Calcular número de filtros aplicados
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (selectedDuration) count++;
        if (selectedStop) count++;
        if (priceRange.max < 20000) count++;
        if (selectedAirlines.length > 0) count++;
        return count;
    }, [selectedDuration, selectedStop, priceRange, selectedAirlines]);

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
                                onChange={(e) => handlePriceChange(parseInt(e.target.value))}
                                className="price-slider"
                            />
                        </div>
                    </div>
                    <div className="filter-section">
                        <label className="filter-label">Duración</label>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input type="checkbox" checked={selectedDuration === "short"} onChange={() => setSelectedDuration(selectedDuration === "short" ? "" : "short")} />
                                <span>Menos de 2 horas</span>
                            </label>
                            <label className="filter-option">
                                <input type="checkbox" checked={selectedDuration === "medium"} onChange={() => setSelectedDuration(selectedDuration === "medium" ? "" : "medium")} />
                                <span>2 - 4 horas</span>
                            </label>
                            <label className="filter-option">
                                <input type="checkbox" checked={selectedDuration === "long"} onChange={() => setSelectedDuration(selectedDuration === "long" ? "" : "long")} />
                                <span>4 - 6 horas</span>
                            </label>
                            <label className="filter-option">
                                <input type="checkbox" checked={selectedDuration === "very-long"} onChange={() => setSelectedDuration(selectedDuration === "very-long" ? "" : "very-long")} />
                                <span>Más de 6 horas</span>
                            </label>
                        </div>
                    </div>
                    <div className="filter-section">
                        <label className="filter-label">Escalas</label>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input type="checkbox" checked={selectedStop === "direct"} onChange={() => setSelectedStop(selectedStop === "direct" ? "" : "direct")} />
                                <span>Directo</span>
                            </label>
                            <label className="filter-option">
                                <input type="checkbox" checked={selectedStop === "one-stop"} onChange={() => setSelectedStop(selectedStop === "one-stop" ? "" : "one-stop")} />
                                <span>1 escala</span>
                            </label>
                            <label className="filter-option">
                                <input type="checkbox" checked={selectedStop === "multi-stop"} onChange={() => setSelectedStop(selectedStop === "multi-stop" ? "" : "multi-stop")} />
                                <span>2 o más escalas</span>
                            </label>
                        </div>
                    </div>
                    <div className="filter-section">
                        <label className="filter-label">Aerolíneas</label>
                        <div className="filter-options">
                            {uniqueAirlines.map((airline) => (
                                <label key={airline} className="filter-option">
                                    <input type="checkbox" checked={selectedAirlines.includes(airline)} onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedAirlines([...selectedAirlines, airline]);
                                        } else {
                                            setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
                                        }
                                    }} />
                                    <span>{airline}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button className="apply-filters-button">
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FilterSidebar;
