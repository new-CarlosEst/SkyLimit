import React from 'react';
import type { FlightResult } from '../../../types/flight.types';
import { useNavigate } from 'react-router-dom';

interface FlightSummaryCardProps {
    flight: FlightResult;
    cabinClass: string | null;
    passengersCount: number;
    extraBaggagePrice: number;
}

const FlightSummaryCard: React.FC<FlightSummaryCardProps> = ({ flight, cabinClass, passengersCount, extraBaggagePrice }) => {
    const navigate = useNavigate();
    const displayClass = cabinClass === 'economy' ? 'Turista' 
                       : cabinClass === 'premiumeconomy' ? 'Turista Premium' 
                       : cabinClass === 'business' ? 'Business' 
                       : cabinClass === 'first' ? 'Primera Clase' 
                       : 'Turista (Básica)';

    const tripTypeStr = flight.legs.length > 1 ? 'Ida y vuelta' : 'Solo ida';
    
    // Add extra baggage to the total
    const basePrice = flight.price.amount;
    const totalExtra = extraBaggagePrice * passengersCount;
    const finalPrice = basePrice + totalExtra;
    
    const pricePerPerson = finalPrice / (passengersCount || 1);
    const currencySymbol = flight.price.currency === 'EUR' ? '€' : flight.price.currency;

    return (
        <div className="card flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
                <h3 className="text-lg text-slate-800 font-medium mb-3">Resumen del vuelo</h3>
                <ul className="text-slate-500 text-sm space-y-1">
                    <li>• {passengersCount} pasajero{passengersCount > 1 ? 's' : ''}</li>
                    <li>• {tripTypeStr}</li>
                    <li>• {displayClass}</li>
                    {extraBaggagePrice > 0 ? (
                        <li>• Equipaje extra añadido (+{extraBaggagePrice}{currencySymbol}/pasajero)</li>
                    ) : (
                        <li>• Equipaje incluido de la tarifa</li>
                    )}
                </ul>
            </div>
            <div className="mt-6 md:mt-0 text-right flex flex-col items-end">
                <div className="text-sm text-slate-500 mb-1">Precio total</div>
                <div className="text-4xl text-[#2b5aa0] font-medium leading-none mb-1">
                    {Math.round(finalPrice)}{currencySymbol}
                </div>
                <div className="text-sm text-slate-500 mb-4">
                    {Math.round(pricePerPerson)}{currencySymbol} por persona
                </div>
                <button 
                    onClick={() => navigate('/passengers')}
                    className="bg-[#2b5aa0] hover:bg-[#1a3c79] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    Continuar con la reserva
                </button>
            </div>
        </div>
    );
};

export default FlightSummaryCard;
