import { useNavigate } from "react-router-dom";
import { usePassengerForm } from "../hooks/usePassengerForm";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import "./PassengerData.css";
import SearchableSelect from "../components/ui/personal/SearchableSelect";
import CustomInput from "../components/ui/personal/CustomInput";
import DateInput from "../components/ui/personal/DateInput";

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

    const today = new Date();

    return (
        <div className="passenger-data-container">
            <div className="passenger-data-content">

                <div className="mb-6 flex">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-[#2b5aa0] hover:bg-[#1a3c79] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                    >
                        <span className="text-xl leading-none mb-0.5">←</span>
                        <span>Volver a las opciones</span>
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
                            className="bg-[#2b5aa0] hover:bg-[#1a3c79] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md transition-colors"
                        >
                            Confirmar y Continuar al Pago
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default PassengerData;
