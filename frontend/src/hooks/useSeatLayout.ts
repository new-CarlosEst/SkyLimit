type SeatInfo = {
    label: string;
    price?: number;
    isOccupied?: boolean;
    isXL?: boolean;
};

interface SeatLayout {
    rows: number;
    seats: SeatInfo[][];
}

export function useSeatLayout(travelClass: string) {
    const getTuristaLayout = (): SeatLayout => {
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

    const getTuristaPremiumLayout = (): SeatLayout => {
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

    const getEjecutivaLayout = (): SeatLayout => {
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

    const getPrimeraClaseLayout = (): SeatLayout => {
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

    const getSeatLayout = (): SeatLayout => {
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

    const getAisles = (): number[] => {
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

    return {
        layout: getSeatLayout(),
        aisles: getAisles(),
        isLarge: travelClass === 'EJECUTIVA' || travelClass === 'PRIMERA CLASE',
        isFirstClass: travelClass === 'PRIMERA CLASE',
        isBusiness: travelClass === 'EJECUTIVA',
    };
}
