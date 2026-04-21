import "./SearchCard.css";
import TripTypePill from "./TripTypePill";
import CabinTypeSelector from "./CabinTypeSelector";
import PassengerSelector from "./PassengerSelector";
import DatePicker from "../../ui/flights/DatePicker";
import AirportInput from "../../ui/flights/AirportInput";
import { useFlightSearch } from "../../../hooks/useFlightSearch";

import locationIcon from "../../../assets/ui/ProiconsLocation.svg";
import planeIcon from "../../../assets/ui/MynauiPlane.svg";

function SearchCard() {
    const {
        //Estados
        tripType,
        multiDestinations,
        cabinClass,
        //----------------------------------------------
        //  Pone que no estan usandose, pero si lo estan haciendo. Pero en el callback de la funcion
        travelDates,
        originAirport,
        destinationAirport,
        passengers,
        //----------------------------------------------
        multiDates,
        multiAirports,

        //Funciones para settear el estado
        setTripType,
        setCabinClass,
        setTravelDates,
        setOriginAirport,
        setDestinationAirport,
        setPassengers,
        setMultiDates,
        setMultiAirports,
        removeDestination,
        addDestination,
        handleSearch,
    } = useFlightSearch(); //Igualo los estados y las funciones de mi hook personalizado

    return (
        <div className="search-card w-full max-w-5xl mb-6" >
            {/* Contenedor para seleccionar entre ida, ida y vuelta y multi */}
            <div className="trip-type">
                <TripTypePill
                    active={tripType === "roundTrip"}
                    name="Ida y Vuelta"
                    onClick={() => setTripType("roundTrip")}
                />
                <TripTypePill
                    active={tripType === "oneWay"}
                    name="Solo Ida"
                    onClick={() => setTripType("oneWay")}
                />
                <TripTypePill
                    active={tripType === "multi"}
                    name="Múltiples Destinos"
                    onClick={() => setTripType("multi")}
                />
            </div>

            {/* inputs para seleccionar origen, destino y fecha y numero de pasajeros */}
            {
                // si es multi destino te renderiza un grid de columnas, si no el grid normal, usando un operador ternario
                tripType === "multi" ? (
                    <div className="multi-container">
                        {multiDestinations.map((_, index) => (
                            <div key={index} className="multi-inputs-grid">
                                <AirportInput
                                    name={`Origen ${index + 1}`}
                                    icon={locationIcon}
                                    placeHolder="¿Desde dónde?"
                                    onAirportSelect={(airport) => {
                                        const newAirports = [...multiAirports];
                                        newAirports[index] = { ...newAirports[index], origin: airport };
                                        setMultiAirports(newAirports);
                                    }}
                                />
                                <AirportInput
                                    name={`Destino ${index + 1}`}
                                    icon={planeIcon}
                                    placeHolder="¿A dónde vas?"
                                    onAirportSelect={(airport) => {
                                        const newAirports = [...multiAirports];
                                        newAirports[index] = { ...newAirports[index], destination: airport };
                                        setMultiAirports(newAirports);
                                    }}
                                />

                                <DatePicker
                                    mode="single"
                                    onDateChange={(date) => {
                                        const newDates = [...multiDates];
                                        newDates[index] = date as Date | null;
                                        setMultiDates(newDates);
                                    }}
                                    name={`Fecha ${index + 1}`}
                                />

                                {/* Boton para eliminar el trayecto que solo se muestra cuando hay mas de un trayect */}
                                {multiDestinations.length > 1 && (

                                    // TODO: Cambiarlo para que le ui del boton de borrar sea mas bonito y este integrado
                                    <button
                                        type="button"
                                        onClick={() => removeDestination(index)}
                                        className="remove-leg-btn"
                                        title="Eliminar trayecto"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M18 6L6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="actions-row">
                            {/* Boton para añadir un nuevo destino que solo se muestra cuando es multi destino */}
                            <button
                                onClick={addDestination}
                                className="add-trayecto-btn"
                            >
                                + Añadir trayecto
                            </button>
                            <div className="w-1/3">
                                <PassengerSelector onPassengersChange={setPassengers} />
                            </div>
                        </div>
                    </div>
                ) : (
                    // Grid de inputs para ida y vuelta y solo ida
                    <div className="inputs-grid">
                        <AirportInput
                            name="Origen"
                            icon={locationIcon}
                            placeHolder="¿Desde dónde?"
                            onAirportSelect={setOriginAirport}
                        />
                        <AirportInput
                            name="Destino"
                            icon={planeIcon}
                            placeHolder="¿A dónde vas?"
                            onAirportSelect={setDestinationAirport}
                        />
                        <DatePicker
                            mode={tripType === "roundTrip" ? "range" : "single"}
                            onDateChange={setTravelDates}
                            name={tripType === "roundTrip" ? "Ida - Vuelta" : "Ida"}
                        />
                        <PassengerSelector onPassengersChange={setPassengers} />
                    </div>
                )
            }
            <div className="cabinClass-container">
                <label className="text-sm font-semibold text-gray-700 tracking-wide">Clase</label>
                <div className="cabin-options-wrapper">
                    <CabinTypeSelector active={cabinClass === "economy"} name="Economy" onClick={() => setCabinClass("economy")} />
                    <CabinTypeSelector active={cabinClass === "premiumeconomy"} name="Premium Economy" onClick={() => setCabinClass("premiumeconomy")} />
                    <CabinTypeSelector active={cabinClass === "business"} name="Business" onClick={() => setCabinClass("business")} />
                    <CabinTypeSelector active={cabinClass === "first"} name="First" onClick={() => setCabinClass("first")} />
                </div>
            </div>

            <div className="search-container mt-8">
                <button type="button" onClick={handleSearch} className="search-button w-full flex items-center justify-center gap-3 py-4 bg-[#2c5aa0] text-white rounded-xl font-bold text-lg hover:bg-[#1e3a6f] transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-900/10 cursor-pointer">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span>Buscar Vuelos</span>
                </button>
            </div>
        </div >
    );
}

export default SearchCard;