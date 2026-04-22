import { useState } from "react";
import type { Airport, Passengers, OneWayData, RoundTripData, MultiTripData } from "../types/airport.types";
import { searchOneWay, searchRoundTrip, searchMultiTrip } from "../api/flights.api";
import { sileo } from "sileo";
import { useFlightSearchStore } from "../store/flightSearchStore";
import { useSearchParamsStore } from "../store/searchParamsStore";
import { useNavigate } from "react-router-dom";

//Tippos que hay de viajes y cabinas
type TripType = "oneWay" | "roundTrip" | "multi";
type CabinClass = "economy" | "premiumeconomy" | "business" | "first";

//Funcion que te permite hacer la busqueda de vuelos con sus parametros
export function useFlightSearch() {
    const navigate = useNavigate();

    const setSearchResults = useFlightSearchStore((state) => state.setSearchResults);
    const setSearchParams = useSearchParamsStore((state) => state.setSearchParams);
    const [tripType, setTripType] = useState<TripType>("roundTrip");
    const [multiDestinations, setMultiDestinations] = useState<number[]>([0]);
    const [cabinClass, setCabinClass] = useState<CabinClass>("economy");
    const [travelDates, setTravelDates] = useState<Date | [Date, Date] | null>(null);
    const [originAirport, setOriginAirport] = useState<Airport | null>(null);
    const [destinationAirport, setDestinationAirport] = useState<Airport | null>(null);
    const [passengers, setPassengers] = useState<Passengers>({
        adults: 1,
        children: 0,
        infants: 0,
    });
    const [multiDates, setMultiDates] = useState<(Date | null)[]>([null]);

    //Estado para guardar aeropuertos de cada leg en múltiples destinos
    const [multiAirports, setMultiAirports] = useState<{ origin: Airport | null; destination: Airport | null }[]>([
        { origin: null, destination: null }
    ]);

    //Borra una leg/trip de el array con multiples destinos
    const removeDestination = (indexToRemove: number) => {
        if (multiDestinations.length > 1) {
            setMultiDestinations(multiDestinations.filter((_, index) => index !== indexToRemove));
            setMultiDates(multiDates.filter((_, index) => index !== indexToRemove));
            setMultiAirports(multiAirports.filter((_, index) => index !== indexToRemove));
        }
    };

    //Añade una leg/trip a el array con multiples destinos
    const addDestination = () => {
        setMultiDestinations([...multiDestinations, multiDestinations.length]);
        setMultiDates([...multiDates, null]);
        setMultiAirports([...multiAirports, { origin: null, destination: null }]);
    };

    //Funcion que maneja la busqueda de vuelos
    const handleSearch = async () => {
        //si es viaje de ida
        if (tripType === "oneWay") {
            if (!originAirport || !destinationAirport || !travelDates) {
                sileo.error({
                    title: "Faltan campos por completar",
                    description: "Por favor completa todos los campos",
                });
                return;
            }

            //Datos de busqueda de ida
            const flightData: OneWayData = {
                originName: originAirport.name,
                destinationName: destinationAirport.name,
                origin: originAirport.iata,
                departure: destinationAirport.iata,
                cabinClass: cabinClass,
                date: (travelDates as Date).toISOString().split('T')[0],
                adults: passengers.adults,
                children: passengers.children,
                infants: passengers.infants,
            };

            //Busqueda de vuelo de ida
            try {
                const result = await searchOneWay(flightData);
                console.log(result);
                setSearchResults(result, "oneWay");
                setSearchParams({
                    originIata: originAirport.iata,
                    destinationIata: destinationAirport.iata,
                    departureDate: (travelDates as Date).toISOString().split('T')[0],
                    returnDate: null,
                    passengers: passengers,
                    cabinClass: cabinClass,
                });
                navigate("/flights");
                return result;
            } catch (error) {
                console.error("Error al buscar vuelos:", error);
                throw error;
            }
        } 
        
        //si es viaje de ida y vuelta
        else if (tripType === "roundTrip") {
            if (!originAirport || !destinationAirport || !travelDates) {
                sileo.error({
                    title: "Faltan campos por completar",
                    description: "Por favor completa todos los campos",
                });
                return;
            }

            //Datos de busqueda de ida y vuelta
            const [departureDate, returnDate] = travelDates as [Date, Date];
            const flightData: RoundTripData = {
                originName: originAirport.name,
                destinationName: destinationAirport.name,
                origin: originAirport.iata,
                departure: destinationAirport.iata,
                cabinClass: cabinClass,
                date: departureDate.toISOString().split('T')[0],
                returnDate: returnDate.toISOString().split('T')[0],
                adults: passengers.adults,
                children: passengers.children,
                infants: passengers.infants,
            };

            try {
                const result = await searchRoundTrip(flightData);
                console.log("Resultado de búsqueda roundTrip:", result);
                setSearchResults(result, "roundTrip");
                setSearchParams({
                    originIata: originAirport.iata,
                    destinationIata: destinationAirport.iata,
                    departureDate: departureDate.toISOString().split('T')[0],
                    returnDate: returnDate.toISOString().split('T')[0],
                    passengers: passengers,
                    cabinClass: cabinClass,
                });
                navigate("/flights");
                return result;
            } catch (error) {
                console.error("Error al buscar vuelos:", error);
                throw error;
            }
        } 
        //Peticion si es multiples destinos
        else if (tripType === "multi") {

            //Va metiendo las legs
            const legs = multiAirports.map((airport, index) => {
                const date = multiDates[index];
                if (!airport.origin || !airport.destination || !date) {
                    return null;
                }
                return {
                    originSkyId: airport.origin.iata,
                    destinationSkyId: airport.destination.iata,
                    date: date.toISOString().split('T')[0],
                };
            }).filter((leg): leg is NonNullable<typeof leg> => leg !== null);

            if (legs.length === 0) {
                sileo.error({
                    title: "Faltan campos por completar",
                    description: "Por favor completa todos los trayectos",
                });
                return;
            }

            const flightData: MultiTripData = {
                legs: legs,
                cabinClass: cabinClass,
                adults: passengers.adults,
            };

            try {
                const result = await searchMultiTrip(flightData);
                console.log("Resultado de búsqueda multi:", result);
                setSearchResults(result, "multi");
                setSearchParams({
                    originIata: legs[0].originSkyId,
                    destinationIata: legs[legs.length - 1].destinationSkyId,
                    departureDate: legs[0].date,
                    returnDate: null,
                    passengers: passengers,
                    cabinClass: cabinClass,
                });
                navigate("/flights");
                return result;
            } catch (error) {
                console.error("Error al buscar vuelos:", error);
                throw error;
            }
        }
    };

    //Devuelve los estados y las funciones para usar
    return {
        // Estados
        tripType,
        multiDestinations,
        cabinClass,
        travelDates,
        originAirport,
        destinationAirport,
        passengers,
        multiDates,
        multiAirports,

        // Setters
        setTripType,
        setCabinClass,
        setTravelDates,
        setOriginAirport,
        setDestinationAirport,
        setPassengers,
        setMultiDates,
        setMultiAirports,

        // Funciones
        removeDestination,
        addDestination,
        handleSearch,
    };
}
