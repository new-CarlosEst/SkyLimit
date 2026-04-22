import type { FlightResult } from "../../../types/flight.types";
import LegData from "../../ui/flights/data/LegData";


interface FlightCardProps {
    flight: FlightResult;
    cabinClass: 'economy' | 'premiumeconomy' | 'business' | 'first' | null;
}

function FlightCard({ flight, cabinClass }: FlightCardProps) {
    return (
        <div className="flex p-4 border border-gray-100 rounded-lg shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-500">
            <div className="flex flex-col gap-4 flex-4">
                {flight.legs.map((leg, index) => (
                    <LegData
                        key={index}
                        airline={leg.carriers[0].name}
                        airlineLogo={leg.carriers[0].logoUrl}
                        duration ={leg.durationMinutes}
                        stops={leg.stopCount}
                        originCity={leg.origin.city}
                        destinationCity={leg.destination.city}
                        originIata={leg.origin.iata}
                        destinationIata={leg.destination.iata}
                        departureTime={leg.departure}
                        arrivalTime={leg.arrival}
                        cabinClass={cabinClass}
                    />
                ))}
            </div>

            <div className="flex flex-col border-l border-gray-200 flex-1 justify-center items-center">
                <p className="text-4xl font-bold text-[#2c5aa0]">{flight.price.formatted}</p>
                <p className="text-gray-700 text-md">por persona</p>
                <button className="text-md mt-4 bg-[#2c5aa0] text-white px-8 py-3 rounded-lg hover:bg-[#1a3d7a] hover:scale-105 transition-all duration-200">Seleccionar</button>
            </div>
        </div>
    );
}

export default FlightCard;
