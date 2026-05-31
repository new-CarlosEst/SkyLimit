import { useNavigate } from "react-router-dom";
import { usePassengerForm } from "../hooks/usePassengerForm";
import { useSearchParamsStore } from "../store/searchParamsStore";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import { useState } from "react";
import { sileo } from "sileo";
import "./PassengerData.css";
import SearchableSelect from "../components/ui/personal/SearchableSelect";
import CustomInput from "../components/ui/personal/CustomInput";
import DateInput from "../components/ui/personal/DateInput";
import SeatSelector from "../components/ui/personal/SeatSelector";
import { useCheckoutStore } from "../store/checkoutStore";
import type { PassengerCheckoutData } from "../types/checkout.types";

// Register Spanish locale
registerLocale("es", es);

// Icons
import personIcon from "../assets/ui/ProiconsPerson.svg";
import phoneIcon from "../assets/ui/Phone.svg";
import passportIcon from "../assets/ui/passport.svg";
import locationIcon from "../assets/ui/ProiconsLocation.svg";
import mailIcon from "../assets/ui/mail.svg";
import genderIcon from "../assets/ui/men-broken.svg";

function PassengerData() {
    const navigate = useNavigate();
    const { passengerList, dates, setPassengerDate, handleSubmit } = usePassengerForm();
    const { cabinClass } = useSearchParamsStore();
    const { travelClass, setPassengers } = useCheckoutStore();
    const [selectedSeats, setSelectedSeats] = useState<Record<number, { seat: string | null; price: number }>>({});
    const [showSeatSelector, setShowSeatSelector] = useState(false);

    const today = new Date();

    const getTravelClass = () => {
        switch (cabinClass) {
            case 'economy':
                return 'TURISTA';
            case 'premiumeconomy':
                return 'TURISTA PREMIUM';
            case 'business':
                return 'EJECUTIVA';
            case 'first':
                return 'PRIMERA CLASE';
            default:
                return 'TURISTA';
        }
    };

    const handleSeatSelect = (passengerIndex: number, seat: string | null, price: number) => {
        setSelectedSeats(prev => ({
            ...prev,
            [passengerIndex]: { seat, price }
        }));
    };

    const handleContinueToSeats = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSeatSelector(true);
        window.scrollTo(0, 0);
    };

    const handleBackToForm = () => {
        setShowSeatSelector(false);
        window.scrollTo(0, 0);
    };

    const handleContinueToPayment = () => {
        console.log("handleContinueToPayment llamado");
        const formEl = document.querySelector("form") as HTMLFormElement | null;
        if (!formEl) {
            console.log("No se encontró el formulario");
            return;
        }

        const formData = new FormData(formEl);
        const passengersPayload: PassengerCheckoutData[] = passengerList.map((passenger, pIdx) => {
            const seatData = selectedSeats[pIdx] || { seat: null, price: 0 };
            return {
                type: passenger.type as "Adulto" | "Niño" | "Bebé",
                name: String(formData.get(`p${pIdx}_name`) || ""),
                surname: String(formData.get(`p${pIdx}_surname`) || ""),
                gender: dates[pIdx]?.gender || "",
                birthDate: dates[pIdx]?.birthDate ? new Date(dates[pIdx].birthDate as Date).toISOString() : "",
                nationality: dates[pIdx]?.nationality || "",
                email: String(formData.get(`p${pIdx}_email`) || ""),
                phone: String(formData.get(`p${pIdx}_phone`) || ""),
                document: {
                    type: dates[pIdx]?.docType || "",
                    number: String(formData.get(`p${pIdx}_doc_number`) || ""),
                    country: dates[pIdx]?.docCountry || "",
                    expirationDate: dates[pIdx]?.docExpiration ? new Date(dates[pIdx].docExpiration as Date).toISOString() : "",
                },
                seat: {
                    seatNumber: seatData.seat,
                    price: seatData.price || 0,
                    cabin: travelClass || getTravelClass(),
                },
            };
        });

        console.log("passengersPayload:", passengersPayload);

        const hasIncompletePassengers = passengersPayload.some((passenger) =>
            !passenger.name ||
            !passenger.surname ||
            !passenger.gender ||
            !passenger.birthDate ||
            !passenger.nationality ||
            !passenger.document.type ||
            !passenger.document.number ||
            !passenger.document.country ||
            !passenger.document.expirationDate,
        );

        console.log("hasIncompletePassengers:", hasIncompletePassengers);

        if (hasIncompletePassengers) {
            sileo.error({
                title: "Faltan datos de pasajeros o documentos",
            });
            return;
        }

        console.log("Seteando pasajeros y navegando a /payment");
        setPassengers(passengersPayload);
        navigate('/payment');
    };

    return (
        <div className="passenger-data-container">
            <div className="passenger-data-content">

                {!showSeatSelector ? (
                    <>
                        <div className="mb-6 flex">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-[#2b5aa0] hover:bg-[#1a3c79] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                            >
                                <span className="text-xl leading-none mb-0.5">←</span>
                                <span>Volver atrás</span>
                            </button>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">Datos de los pasajeros</h1>
                            <p className="text-slate-600">Por favor, introduce los datos tal y como aparecen en el documento de identidad oficial.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                    {passengerList.map((passenger, pIdx) => (
                        <div key={pIdx} className="passenger-card">
                            <div className="passenger-card-header">
                                <h2 className="passenger-card-title">
                                    Pasajero {pIdx + 1} <span className="text-base font-normal text-slate-500 ml-2">({passenger.type})</span>
                                </h2>
                            </div>

                            {/* Datos personales */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-slate-700 mb-4">Datos Personales</h3>
                                <div className="form-grid">
                                    <CustomInput label="Nombre"    name={`p${pIdx}_name`}    placeholder="Tu nombre"    icon={personIcon} />
                                    <CustomInput label="Apellidos" name={`p${pIdx}_surname`}  placeholder="Tus apellidos" icon={personIcon} />
                                    <SearchableSelect
                                        label="Género"
                                        name={`p${pIdx}_gender`}
                                        value={dates[pIdx]?.gender || ''}
                                        onChange={(value) => setPassengerDate(pIdx, 'gender', value)}
                                        icon={genderIcon}
                                        options={[
                                            { value: "M", label: "Hombre" },
                                            { value: "F", label: "Mujer"  },
                                            { value: "O", label: "Otro"   },
                                        ]}
                                    />
                                    <DateInput
                                        label="Fecha de Nacimiento"
                                        name={`p${pIdx}_birthdate`}
                                        value={dates[pIdx]?.birthDate}
                                        onChange={(d) => setPassengerDate(pIdx, "birthDate", d)}
                                        maxDate={today}
                                    />
                                    <SearchableSelect 
                                        label="Nacionalidad" 
                                        name={`p${pIdx}_nationality`} 
                                        value={dates[pIdx]?.nationality || ''} 
                                        onChange={(value) => setPassengerDate(pIdx, 'nationality', value)}
                                        placeholder="Ej: España" 
                                        icon={locationIcon} 
                                        useCountries={true}
                                    />

                                    {passenger.type === "Adulto" && (
                                        <>
                                            <CustomInput label="Correo Electrónico" name={`p${pIdx}_email`} type="email" placeholder="ejemplo@correo.com" icon={mailIcon} />
                                            <CustomInput label="Teléfono"           name={`p${pIdx}_phone`} type="tel"   placeholder="+34 600 000 000"   icon={phoneIcon} />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Documento de identidad */}
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <h3 className="text-lg font-medium text-slate-700 mb-4">Documento de Identidad</h3>
                                <div className="form-grid">
                                    <SearchableSelect
                                        label="Tipo de Documento"
                                        name={`p${pIdx}_doc_type`}
                                        value={dates[pIdx]?.docType || ''}
                                        onChange={(value) => setPassengerDate(pIdx, 'docType', value)}
                                        icon={passportIcon}
                                        options={[
                                            { value: "DNI",      label: "DNI / Documento Nacional" },
                                            { value: "PASSPORT", label: "Pasaporte" },
                                        ]}
                                    />
                                    <CustomInput label="Número de Documento" name={`p${pIdx}_doc_number`}  placeholder="Número del documento" icon={passportIcon} />
                                    <SearchableSelect 
                                        label="País de Expedición" 
                                        name={`p${pIdx}_doc_country`} 
                                        value={dates[pIdx]?.docCountry || ''} 
                                        onChange={(value) => setPassengerDate(pIdx, 'docCountry', value)}
                                        placeholder="Ej: España" 
                                        icon={locationIcon} 
                                        useCountries={true}
                                    />
                                    <DateInput
                                        label="Fecha de Caducidad"
                                        name={`p${pIdx}_doc_expiration`}
                                        value={dates[pIdx]?.docExpiration}
                                        onChange={(d) => setPassengerDate(pIdx, "docExpiration", d)}
                                        minDate={today}
                                    />
                                </div>
                            </div>

                        </div>
                    ))}

                    <div className="flex justify-end mt-8 mb-12">
                        <button
                            type="submit"
                            onClick={handleContinueToSeats}
                            className="bg-[#2b5aa0] hover:bg-[#1a3c79] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md transition-colors"
                        >
                            Continuar a Selección de Asientos
                        </button>
                    </div>
                </form>
                    </>
                ) : (
                    <>
                        <div className="mb-6 flex">
                            <button
                                type="button"
                                onClick={handleBackToForm}
                                className="bg-[#2b5aa0] hover:bg-[#1a3c79] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                            >
                                <span className="text-xl leading-none mb-0.5">←</span>
                                <span>Volver a Datos del Pasajero</span>
                            </button>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">Selección de Asientos</h1>
                            <p className="text-slate-600">Selecciona tus asientos para cada pasajero.</p>
                        </div>

                        {passengerList.map((passenger, pIdx) => (
                            <div key={pIdx} className="mb-8">
                                <h3 className="text-lg font-medium text-slate-700 mb-4">
                                    Pasajero {pIdx + 1} ({passenger.type})
                                </h3>
                                <SeatSelector
                                    travelClass={getTravelClass()}
                                    onSeatSelect={(seat, price) => handleSeatSelect(pIdx, seat, price)}
                                />
                            </div>
                        ))}
                        <div className="flex justify-end mt-8 mb-12">
                            <button
                                type="button"
                                onClick={handleContinueToPayment}
                                className="bg-[#2b5aa0] hover:bg-[#1a3c79] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md transition-colors"
                            >
                                Confirmar y Continuar al Pago
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

export default PassengerData;
