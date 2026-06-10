import { useNavigate } from "react-router-dom";
import { useFlightSelector } from "../hooks/useFlightSelector";
import FlightDetailsCard from "../components/flights/flightSelector/FlightDetailsCard";
import BaggageInfoCard from "../components/flights/flightSelector/BaggageInfoCard";
import FlightSummaryCard from "../components/flights/flightSelector/FlightSummaryCard";
import { useCheckoutStore } from "../store/checkoutStore";
import "./FlightSelector.css";

function FlightSelector() {
    const navigate = useNavigate();
    const {
        flightToDisplay,
        cabinClass,
        passengersCount,
        isClassic,
        addCheckedBag,
        extraBaggagePrice,
        handleToggleClassic,
        handleToggleCheckedBag,
    } = useFlightSelector();
    const { setFlightConfig } = useCheckoutStore();

    const handleContinue = () => {
        const travelClass = cabinClass === 'economy'
            ? 'TURISTA'
            : cabinClass === 'premiumeconomy'
                ? 'TURISTA PREMIUM'
                : cabinClass === 'business'
                    ? 'EJECUTIVA'
                    : cabinClass === 'first'
                        ? 'PRIMERA CLASE'
                        : 'TURISTA';

        setFlightConfig({
            travelClass,
            selectedFlight: flightToDisplay,
            fareType: isClassic ? 'CLASSIC' : 'BASIC',
            checkedBag: addCheckedBag,
            baggagePricePerPassenger: extraBaggagePrice,
        });

        navigate('/passengers');
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
                    onContinue={handleContinue}
                />
            </div>
        </div>
    );
}

export default FlightSelector;