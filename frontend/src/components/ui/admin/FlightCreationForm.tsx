import { useState } from "react";
import { sileo } from "sileo";
import { createFlight } from "../../../api/flights.api";
import type { Airport } from "../../../types/airport.types";
import AirportAutocompleteInput from "../personal/AirportAutocompleteInput";
import TwoStepDatePicker from "./TwoStepDatePicker";
import "../../../pages/AdminPanel.css";

import MynauiPlane from "../../../assets/ui/MynauiPlane.svg";
import HugeiconsAirport from "../../../assets/ui/HugeiconsAirport.svg";
import IconoirCalendar from "../../../assets/ui/IconoirCalendar.svg";
import text from "../../../assets/ui/text.svg";

function FlightCreationForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        departureDateTime: null as Date | null,
        arrivalDateTime: null as Date | null,
        airline: "",
        price: "",
        stopoverCount: "",
        source: "Created"
    });
    const [departureAirport, setDepartureAirport] = useState<Airport | null>(null);
    const [arrivalAirport, setArrivalAirport] = useState<Airport | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!departureAirport || !arrivalAirport) {
                sileo.error({
                    title: "Error de validación",
                    description: "Debes seleccionar ambos aeropuertos"
                });
                return;
            }

            // Validar fechas
            if (!formData.departureDateTime || !formData.arrivalDateTime) {
                sileo.error({
                    title: "Error de validación",
                    description: "Debes seleccionar ambas fechas y horas"
                });
                return;
            }

            // Validar que la fecha de llegada sea posterior a la de salida
            if (formData.arrivalDateTime <= formData.departureDateTime) {
                sileo.error({
                    title: "Error de validación",
                    description: "La fecha y hora de llegada debe ser posterior a la de salida"
                });
                return;
            }

            // Generar número de vuelo automático
            const generateFlightNumber = () => {
                const randomNumbers = Math.floor(100000 + Math.random() * 900000);
                return `skylimit-${randomNumbers}`;
            };

            // Convertir fechas Date a formato string YYYY-MM-DDTHH:mm:ss
            const formatDateToString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            // Calcular duración del vuelo en minutos
            const calculateFlightDuration = (departure: Date, arrival: Date) => {
                const durationMs = arrival.getTime() - departure.getTime();
                const durationMinutes = Math.floor(durationMs / (1000 * 60));
                return durationMinutes;
            };

            const flightData = {
                flightNumber: generateFlightNumber(),
                departureDateTime: formatDateToString(formData.departureDateTime),
                arrivalDateTime: formatDateToString(formData.arrivalDateTime),
                airline: formData.airline,
                price: parseFloat(formData.price),
                airportDepartureId: departureAirport.id,
                airportArrivalId: arrivalAirport.id,
                stopoverCount: formData.stopoverCount ? parseInt(formData.stopoverCount) : undefined,
                flightDuration: calculateFlightDuration(formData.departureDateTime, formData.arrivalDateTime),
                source: formData.source
            };

            await createFlight(flightData);
            sileo.success({ title: "Vuelo creado correctamente" });
            
            // Reset form
            setFormData({
                departureDateTime: null,
                arrivalDateTime: null,
                airline: "",
                price: "",
                stopoverCount: "",
                source: "Created"
            });
            setDepartureAirport(null);
            setArrivalAirport(null);
        } catch (err: any) {
            sileo.error({
                title: "Error al crear vuelo",
                description: err.response?.data?.message || "Verifica los datos e inténtalo de nuevo"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 className="card-title">Crear Nuevo Vuelo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                    <label className="form-label">
                        Aerolínea
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <div className="p-2 border-r border-gray-300">
                            <img src={text} alt="Airline" className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            name="airline"
                            value={formData.airline}
                            onChange={handleInputChange}
                            placeholder="Ej: Iberia"
                            className="flex-1 px-3 py-2 focus:outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="form-grid">
                    <AirportAutocompleteInput
                        name="Aeropuerto de Salida"
                        placeHolder="Buscar aeropuerto de salida..."
                        onAirportSelect={setDepartureAirport}
                        selectedAirport={departureAirport}
                    />
                    
                    <AirportAutocompleteInput
                        name="Aeropuerto de Llegada"
                        placeHolder="Buscar aeropuerto de llegada..."
                        onAirportSelect={setArrivalAirport}
                        selectedAirport={arrivalAirport}
                    />
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">
                            Fecha y Hora de Salida
                        </label>
                        <TwoStepDatePicker
                            selected={formData.departureDateTime}
                            onChange={(date: Date | null) => setFormData(prev => ({ ...prev, departureDateTime: date }))}
                            placeholderText="Seleccionar fecha y hora de salida"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">
                            Fecha y Hora de Llegada
                        </label>
                        <TwoStepDatePicker
                            selected={formData.arrivalDateTime}
                            onChange={(date: Date | null) => setFormData(prev => ({ ...prev, arrivalDateTime: date }))}
                            placeholderText="Seleccionar fecha y hora de llegada"
                            minDate={formData.departureDateTime || undefined}
                            required
                        />
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">
                            Precio (€)
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <div className="p-2 border-r border-gray-300">
                                <span className="text-green-600 font-bold">€</span>
                            </div>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                placeholder="Ej: 150.50"
                                className="flex-1 px-3 py-2 focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">
                            Número de Escalas
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <div className="p-2 border-r border-gray-300">
                                <span className="text-blue-600 font-bold">#</span>
                            </div>
                            <input
                                type="number"
                                name="stopoverCount"
                                value={formData.stopoverCount}
                                onChange={handleInputChange}
                                placeholder="Ej: 0, 1, 2..."
                                className="flex-1 px-3 py-2 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                                
                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                >
                    <div className="flex items-center justify-center">
                        <img src={MynauiPlane} alt="Plane" className="w-5 h-5 mr-2" />
                        {loading ? "Creando vuelo..." : "Crear Vuelo"}
                    </div>
                </button>
            </form>
        </div>
    );
}

export default FlightCreationForm;
