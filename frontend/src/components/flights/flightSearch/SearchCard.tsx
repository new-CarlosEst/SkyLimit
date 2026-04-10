import "./SearchCard.css";
import { useState } from "react";
import TripTypePill from "./TripTypePill";
import InputPill from "./InputPill";
import CabinTypeSelector from "./CabinTypeSelector";
import PassengerSelector from "./PassengerSelector";

import locationIcon from "../../../assets/ui/ProiconsLocation.svg";
import planeIcon from "../../../assets/ui/MynauiPlane.svg";
import calendarIcon from "../../../assets/ui/IconoirCalendar.svg";

//Me creo un tipo para ver el tipo de viaje
type TripType = "oneWay" | "roundTrip" | "multi";

//Me croe un tipo para ver el tipo de cabina
type CabinClass = "economy" | "premiumeconomy" | "business" | "first";

function SearchCard() {
    //Para el cambio entre ida y vuelta, solo ida y multiples destinos
    const [tripType, setTripType] = useState<TripType>("roundTrip");

    //Array para guardar los destinos multiples
    const [multiDestinations, setMultiDestinations] = useState<number[]>([0]);

    //Estado para guardar el tipo de cabina
    const [cabinClass, setCabinClass] = useState<CabinClass>("economy");

    //Funcion que recibe el indice del array del destino a borrar y lo saca del array
    const removeDestination = (indexToRemove: number) => {
        if (multiDestinations.length > 1) {
            //En vez de borrar del array hace un filtro y se queda con los indices que no coinciden con el que va a borrar y cambia el valor de array por el del filtro
            setMultiDestinations(multiDestinations.filter((_, index) => index !== indexToRemove));
        }
    };

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
                                <InputPill
                                    name={`Origen ${index + 1}`}
                                    icon={locationIcon}
                                    placeHolder="¿Desde dónde?"
                                    inputType="text"
                                />
                                <InputPill
                                    name={`Destino ${index + 1}`}
                                    icon={planeIcon}
                                    placeHolder="¿A dónde vas?"
                                    inputType="text"
                                />

                                {/* TODO: Cambiar esto a un componente que usa la libreria React Datepicker */}
                                <InputPill
                                    name={`Fecha ${index + 1}`}
                                    icon={calendarIcon}
                                    placeHolder="Selecciona fecha"
                                    inputType="date"
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
                                onClick={() =>
                                    setMultiDestinations([...multiDestinations, multiDestinations.length])
                                }
                                className="add-trayecto-btn"
                            >
                                + Añadir trayecto
                            </button>
                            <div className="w-1/3">
                                <PassengerSelector />
                            </div>
                        </div>
                    </div>
                ) : (
                    // Grid de inputs para ida y vuelta y solo ida
                    <div className="inputs-grid">
                        <InputPill
                            name="Origen"
                            icon={locationIcon}
                            placeHolder="¿Desde dónde?"
                            inputType="text"
                        />
                        <InputPill
                            name="Destino"
                            icon={planeIcon}
                            placeHolder="¿A dónde vas?"
                            inputType="text"
                        />
                        <InputPill
                            name="Fecha"
                            icon={calendarIcon}
                            placeHolder={tripType === "roundTrip" ? "Ida - Vuelta" : "Ida"}
                            inputType="date"
                        />
                        <PassengerSelector />
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
                <button type="button" className="search-button w-full flex items-center justify-center gap-3 py-4 bg-[#2c5aa0] text-white rounded-xl font-bold text-lg hover:bg-[#1e3a6f] transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-900/10 cursor-pointer">
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