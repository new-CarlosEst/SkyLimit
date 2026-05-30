import { useState } from 'react';
import { useSearchParamsStore } from '../store/searchParamsStore';

interface PassengerFormState {
    birthDate: Date | null;
    docExpiration: Date | null;
    nationality: string;
    docCountry: string;
    gender: string;
    docType: string;
}

interface Passenger {
    type: string;
    index: number;
}

interface UsePassengerFormReturn {
    passengerList: Passenger[];
    dates: PassengerFormState[];
    setPassengerDate: (pIdx: number, field: keyof PassengerFormState, value: Date | null | string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export function usePassengerForm(): UsePassengerFormReturn {
    const { passengers } = useSearchParamsStore();

    const adults = passengers?.adults || 1;
    const children = passengers?.children || 0;
    const infants = passengers?.infants || 0;

    // Build passenger list
    const passengerList: Passenger[] = [];
    for (let i = 0; i < adults; i++) passengerList.push({ type: "Adulto", index: i + 1 });
    for (let i = 0; i < children; i++) passengerList.push({ type: "Niño", index: i + 1 });
    for (let i = 0; i < infants; i++) passengerList.push({ type: "Bebé", index: i + 1 });

    // Date state for each passenger
    const [dates, setDates] = useState<PassengerFormState[]>(
        passengerList.map(() => ({ birthDate: null, docExpiration: null, nationality: '', docCountry: '', gender: '', docType: '' }))
    );

    const setPassengerDate = (pIdx: number, field: keyof PassengerFormState, value: Date | null | string) => {
        setDates(prev => {
            const next = [...prev];
            next[pIdx] = { ...next[pIdx], [field]: value };
            return next;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: send data to backend
        console.log("Form submitted", dates);
    };

    return {
        passengerList,
        dates,
        setPassengerDate,
        handleSubmit,
    };
}
