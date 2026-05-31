import { useState } from 'react';
import Seat from './Seat';
import './SeatSelector.css';

interface SeatSelectorProps {
    travelClass: string;
    onSeatSelect: (seat: string | null, price: number) => void;
}

type SeatInfo = {
    label: string;
    price?: number;
    isOccupied?: boolean;
    isXL?: boolean;
};

function SeatSelector({ travelClass, onSeatSelect }: SeatSelectorProps) {
    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
    const [skipSeat, setSkipSeat] = useState(false);

    const getSeatLayout = () => {
        switch (travelClass) {
            case 'TURISTA':
                return getTuristaLayout();
            case 'TURISTA PREMIUM':
                return getTuristaPremiumLayout();
            case 'EJECUTIVA':
                return getEjecutivaLayout();
            case 'PRIMERA CLASE':
                return getPrimeraClaseLayout();
            default:
                return getTuristaLayout();
        }
    };

    const getTuristaLayout = (): { rows: number; seats: SeatInfo[][] } => {
        const rows: SeatInfo[][] = [];
        for (let row = 11; row <= 30; row++) {
            const seats: SeatInfo[] = [];
            const isXL = row >= 11 && row <= 14;
            
            // Left side: A, B, C
            seats.push({ label: 'A', price: isXL ? 18 : (row >= 15 ? 8 : 0), isXL });
            seats.push({ label: 'B', price: isXL ? 18 : (row >= 15 ? 5 : 0), isXL });
            seats.push({ label: 'C', price: isXL ? 18 : (row >= 15 ? 8 : 0), isXL });
            
            // Right side: D, E, F
            seats.push({ label: 'D', price: isXL ? 18 : (row >= 15 ? 8 : 0), isXL });
            seats.push({ label: 'E', price: isXL ? 18 : (row >= 15 ? 5 : 0), isXL });
            seats.push({ label: 'F', price: isXL ? 18 : (row >= 15 ? 8 : 0), isXL });
            
            rows.push(seats);
        }
        return { rows: 20, seats: rows };
    };

    const getTuristaPremiumLayout = (): { rows: number; seats: SeatInfo[][] } => {
        const rows: SeatInfo[][] = [];
        for (let row = 1; row <= 8; row++) {
            const seats: SeatInfo[] = [];
            
            // Left side: A, B
            seats.push({ label: 'A', price: 0 });
            seats.push({ label: 'B', price: 0 });
            
            // Middle: C, D, E
            seats.push({ label: 'C', price: 0 });
            seats.push({ label: 'D', price: 0 });
            seats.push({ label: 'E', price: 0 });
            
            // Right side: F, G
            seats.push({ label: 'F', price: 0 });
            seats.push({ label: 'G', price: 0 });
            
            rows.push(seats);
        }
        return { rows: 8, seats: rows };
    };

    const getEjecutivaLayout = (): { rows: number; seats: SeatInfo[][] } => {
        const rows: SeatInfo[][] = [];
        for (let row = 1; row <= 6; row++) {
            const seats: SeatInfo[] = [];
            
            // Left: A
            seats.push({ label: 'A', price: 0 });
            
            // Middle: D, G
            seats.push({ label: 'D', price: 0 });
            seats.push({ label: 'G', price: 0 });
            
            // Right: K
            seats.push({ label: 'K', price: 0 });
            
            rows.push(seats);
        }
        return { rows: 6, seats: rows };
    };

    const getPrimeraClaseLayout = (): { rows: number; seats: SeatInfo[][] } => {
        const rows: SeatInfo[][] = [];
        for (let row = 1; row <= 3; row++) {
            const seats: SeatInfo[] = [];
            
            // Left: A
            seats.push({ label: 'A', price: 0 });
            
            // Middle: D
            seats.push({ label: 'D', price: 0 });
            
            // Right: F
            seats.push({ label: 'F', price: 0 });
            
            rows.push(seats);
        }
        return { rows: 3, seats: rows };
    };

    const layout = getSeatLayout();
    const isLarge = travelClass === 'EJECUTIVA' || travelClass === 'PRIMERA CLASE';
    const isFirstClass = travelClass === 'PRIMERA CLASE';
    const isBusiness = travelClass === 'EJECUTIVA';

    const handleSeatSelect = (row: number, seatLabel: string, price?: number) => {
        if (skipSeat) {
            setSkipSeat(false);
        }
        const seatId = `${row}${seatLabel}`;
        setSelectedSeat(seatId);
        onSeatSelect(seatId, price || 0);
    };

    const handleSkipSeat = () => {
        setSkipSeat(!skipSeat);
        setSelectedSeat(null);
        onSeatSelect(null, 0);
    };

    const getAisles = () => {
        switch (travelClass) {
            case 'TURISTA':
                return [3]; // After C
            case 'TURISTA PREMIUM':
                return [2, 5]; // After B, after E
            case 'EJECUTIVA':
                return [1, 3]; // After A, after G
            case 'PRIMERA CLASE':
                return [1, 2]; // After A, after D
            default:
                return [3];
        }
    };

    const aisles = getAisles();
    const totalPrice = selectedSeat ? layout.seats.flat().find(s => selectedSeat.endsWith(s.label))?.price || 0 : 0;

    return (
        <div className="seat-selector-container">
            <div className="seat-selector-header">
                <h2 className="seat-selector-title">Selecciona tu asiento</h2>
                <p className="seat-selector-subtitle">Clase: {travelClass}</p>
            </div>

            <div className="seat-legend">
                <div className="seat-legend-item">
                    <div className="seat-legend-color available"></div>
                    <span>Disponible</span>
                </div>
                <div className="seat-legend-item">
                    <div className="seat-legend-color selected"></div>
                    <span>Seleccionado</span>
                </div>
                <div className="seat-legend-item">
                    <div className="seat-legend-color occupied"></div>
                    <span>Ocupado</span>
                </div>
                {travelClass === 'TURISTA' && (
                    <div className="seat-legend-item">
                        <div className="seat-legend-color xl"></div>
                        <span>XL (+18€)</span>
                    </div>
                )}
            </div>

            <div className={`aircraft-container ${isBusiness ? 'business' : ''} ${isFirstClass ? 'first-class' : ''}`}>
                <div className="aircraft-nose"></div>
                <div className="seat-grid">
                    {layout.seats.map((rowSeats, rowIndex) => {
                        const rowNumber = travelClass === 'TURISTA' ? rowIndex + 11 : rowIndex + 1;
                        return (
                            <div key={rowNumber} className="seat-row">
                                <span className="seat-row-number">{rowNumber}</span>
                                {rowSeats.map((seat, seatIndex) => {
                                    const showAisle = aisles.includes(seatIndex);
                                    return (
                                        <div key={seat.label}>
                                            <Seat
                                                row={rowNumber}
                                                label={seat.label}
                                                price={seat.price}
                                                isSelected={selectedSeat === `${rowNumber}${seat.label}`}
                                                isOccupied={seat.isOccupied}
                                                isXL={seat.isXL}
                                                isLarge={isLarge}
                                                onSelect={() => handleSeatSelect(rowNumber, seat.label, seat.price)}
                                            />
                                            {showAisle && <div className="aisle"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            <label className="skip-seat-option">
                <input
                    type="checkbox"
                    checked={skipSeat}
                    onChange={handleSkipSeat}
                />
                <span className="skip-seat-label">No seleccionar asiento (asignación automática)</span>
            </label>

            {totalPrice > 0 && (
                <div className="total-price">
                    <div className="total-price-label">Suplemento por asiento</div>
                    <div className="total-price-amount">+{totalPrice}€</div>
                </div>
            )}
        </div>
    );
}

export default SeatSelector;
