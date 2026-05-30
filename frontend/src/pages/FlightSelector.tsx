import React, { useState } from "react";
import { useFlightSelectedStore } from "../store/flightSelectedStore";
import { useSearchParamsStore } from "../store/searchParamsStore";
import FlightDetailsCard from "../components/flights/flightSelector/FlightDetailsCard";
import BaggageInfoCard from "../components/flights/flightSelector/BaggageInfoCard";
import FlightSummaryCard from "../components/flights/flightSelector/FlightSummaryCard";
import "./FlightSelector.css";
import { useNavigate } from "react-router-dom";
import pointLeftArrow from "../assets/ui/pointLeftArrow.svg";

function FlightSelector() {
    //Saco los datos de cabina, del vuelo, de los passageros
    const { selectedFlight, cabinClass } = useFlightSelectedStore();
    const { passengers } = useSearchParamsStore();
    const navigate = useNavigate();

    const [isClassic, setIsClassic] = useState(false);
    const [addCheckedBag, setAddCheckedBag] = useState(false);

    const passengersCount = passengers ? (passengers.adults + passengers.children + passengers.infants) : 2;

    // For visualization purposes, mock a flight if none is selected
    const mockFlight = {
        id: "mock1",
        price: { amount: 794, currency: "EUR", formatted: "794€" },
        legs: [
            {
                origin: { iata: "MAD", name: "Madrid", city: "Madrid", country: "ES" },
                destination: { iata: "BCN", name: "Barcelona", city: "Barcelona", country: "ES" },
                departure: "2026-05-30T21:35:00",
                arrival: "2026-05-30T22:50:00",
                durationMinutes: 75,
                stopCount: 0,
                carriers: [{ name: "Iberia", logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/IB.png" }]
            },
            {
                origin: { iata: "BCN", name: "Barcelona", city: "Barcelona", country: "ES" },
                destination: { iata: "MAD", name: "Madrid", city: "Madrid", country: "ES" },
                departure: "2026-06-05T14:50:00",
                arrival: "2026-06-05T16:15:00",
                durationMinutes: 85,
                stopCount: 0,
                carriers: [{ name: "Iberia", logoUrl: "https://logos.skyscnr.com/images/airlines/favicon/IB.png" }]
            }
        ]
    };

    const flightToDisplay = selectedFlight || (mockFlight as any);

    // Calculate extra baggage price
    const extraBaggagePrice = (cabinClass === 'economy' || !cabinClass) 
        ? (isClassic ? 35 : (addCheckedBag ? 30 : 0)) 
        : 0;

    const handleToggleClassic = (value: boolean) => {
        setIsClassic(value);
        if (value) setAddCheckedBag(false);
    };

    const handleToggleCheckedBag = (value: boolean) => {
        setAddCheckedBag(value);
        if (value) setIsClassic(false); // Can't have both, classic already includes it
    };

    return (
        <div className="flight-selector-container">
            <div className="flight-selector-content">
                <div className="mb-6 flex">
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-[#2b5aa0] hover:bg-[#1a3c79] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                        style={{ display: 'flex', position: 'relative', zIndex: 50 }}
                    >
                        <span className="text-xl leading-none mb-0.5">←</span>
                        <span>Volver a la búsqueda</span>
                    </button>
                </div>
                
                <FlightDetailsCard 
                    flight={flightToDisplay} 
                    cabinClass={cabinClass} 
                    passengers={passengersCount} 
                />
                
                <BaggageInfoCard 
                    cabinClass={cabinClass}
                    isClassic={isClassic}
                    addCheckedBag={addCheckedBag}
                    onToggleClassic={handleToggleClassic}
                    onToggleCheckedBag={handleToggleCheckedBag}
                />
                
                <FlightSummaryCard 
                    flight={flightToDisplay} 
                    cabinClass={cabinClass} 
                    passengersCount={passengersCount} 
                    extraBaggagePrice={extraBaggagePrice}
                />
            </div>
        </div>
    );
}

export default FlightSelector;