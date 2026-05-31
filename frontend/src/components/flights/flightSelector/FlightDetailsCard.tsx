import React from 'react';
import type { FlightResult } from '../../../types/flight.types';
import clockIcon from '../../../assets/ui/LucideClock.svg';
import planeIcon from '../../../assets/ui/MynauiPlane.svg';

interface FlightDetailsCardProps {
    flight: FlightResult;
    cabinClass: string | null;
    passengers: number;
}

const FlightDetailsCard: React.FC<FlightDetailsCardProps> = ({ flight, cabinClass, passengers }) => {
    // Helper to format minutes to "Xh Ym"
    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    // Helper to extract time "HH:MM"
    const extractTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const displayClass = cabinClass === 'economy' ? 'Turista' 
                       : cabinClass === 'premiumeconomy' ? 'Turista Premium' 
                       : cabinClass === 'business' ? 'Business' 
                       : cabinClass === 'first' ? 'Primera Clase' 
                       : 'Turista Premium';

    const pricePerPerson = flight.price.amount / (passengers || 1);
    const currencySymbol = flight.price.currency === 'EUR' ? '€' : flight.price.currency;

    return (
        <div className="card">
            <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    {flight.legs[0]?.carriers[0]?.logoUrl && flight.legs[0]?.carriers[0]?.logoUrl !== '' ? (
                        <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden bg-slate-100">
                            <img 
                                src={flight.legs[0].carriers[0].logoUrl} 
                                alt={flight.legs[0]?.carriers[0]?.name} 
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : null}
                    <span className="font-medium text-slate-800">{flight.legs[0]?.carriers[0]?.name || 'Iberia'}</span>
                    <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full ml-2">{displayClass}</span>
                </div>
                <div className="text-right">
                    <div className="text-3xl text-[#2b5aa0]">{Math.round(pricePerPerson)}{currencySymbol}</div>
                    <div className="text-sm text-slate-500">por persona</div>
                </div>
            </div>

            {flight.legs.map((leg, index) => (
                <div key={index} className="pt-6 pb-6 last:pb-0 border-b last:border-0 border-slate-100">
                    <h3 className="text-slate-800 font-medium mb-6">
                        Vuelo de {index === 0 ? 'ida' : 'vuelta'}
                    </h3>
                    <div className="flex justify-between items-center">
                        <div className="flight-time-block w-24">
                            <div className="flight-time">{extractTime(leg.departure)}</div>
                            <div className="flight-code">{leg.origin.iata}</div>
                            <div className="flight-city">{leg.origin.city || leg.origin.name}</div>
                        </div>

                        <div className="flex-1 px-8 flight-duration relative">
                            <div className="flex items-center gap-1 mb-2 text-slate-500">
                                <img src={clockIcon} alt="clock" className="w-4 h-4 opacity-50" />
                                <span>{formatDuration(leg.durationMinutes)}</span>
                            </div>
                            <div className="w-full relative flex items-center justify-center py-2">
                                <div className="h-px bg-slate-200 w-full"></div>
                                <div className="bg-white px-2 absolute text-slate-400">
                                    <img src={planeIcon} alt="plane" className="w-5 h-5 opacity-60" />
                                </div>
                            </div>
                            <div className="text-slate-500 mt-2">
                                {leg.stopCount === 0 ? 'Sin escalas' : `${leg.stopCount} escala(s)`}
                            </div>
                        </div>

                        <div className="flight-time-block w-24 text-right">
                            <div className="flight-time">{extractTime(leg.arrival)}</div>
                            <div className="flight-code">{leg.destination.iata}</div>
                            <div className="flight-city">{leg.destination.city || leg.destination.name}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FlightDetailsCard;
