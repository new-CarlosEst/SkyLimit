import { useAuthStore } from "../../../store/authStore";
import { usePersonalDataForm } from "../../../hooks/usePersonalDataForm";
import { useFavoriteAirport } from "../../../hooks/useFavoriteAirport";
import "../../../pages/PersonalData.css";
import mail from "../../../assets/ui/mail.svg";
import ProiconsPerson from "../../../assets/ui/ProiconsPerson.svg";
import CircumAirportSign1 from "../../../assets/ui/CircumAirportSign1.svg";
import AirportAutocompleteInput from "./AirportAutocompleteInput";

function PersonalDataForm() {
    const { user } = useAuthStore();
    
    // Usar hooks personalizados
    const { isSubmitting, nameInputRef, surnameInputRef, handleSubmit } = usePersonalDataForm();
    const { favoriteAirport, selectedAirport, handleAirportSelect, clearSelectedAirport } = useFavoriteAirport();

    const handleFormSubmit = async (e: React.FormEvent) => {
        await handleSubmit(e, selectedAirport?.id);
        
        // Si el formulario se envió correctamente, limpiar la selección del aeropuerto
        if (selectedAirport) {
            clearSelectedAirport();
        }
    };

    return (
        <div className="card">
            <h2 className="card-title">Datos Personales</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">
                            Nombre
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <div className="p-2 border-r border-gray-300">
                                <img src={ProiconsPerson} alt="Person" className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                ref={nameInputRef}
                                defaultValue={user?.name || ""}
                                className="flex-1 px-3 py-2 focus:outline-none"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">
                            Apellidos
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <div className="p-2 border-r border-gray-300">
                                <img src={ProiconsPerson} alt="Person" className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="surname"
                                ref={surnameInputRef}
                                defaultValue={user?.surname || ""}
                                className="flex-1 px-3 py-2 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="form-group">
                    <label className="form-label">
                        Correo Electrónico
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <div className="p-2 border-r border-gray-300">
                            <img src={mail} alt="Email" className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            defaultValue={user?.email || ""}
                            disabled
                            className="flex-1 px-3 py-2 bg-gray-50 focus:outline-none"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">El correo electrónico no se puede modificar</p>
                </div>
                
                <div className="form-group">
                    <label className="form-label">
                        Aeropuerto Favorito
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <div className="p-2 border-r border-gray-300">
                            <img src={CircumAirportSign1} alt="Airport" className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={favoriteAirport ? `${favoriteAirport.city} - ${favoriteAirport.name} (${favoriteAirport.country})` : "No tiene aeropuerto favorito configurado"}
                            disabled
                            className="flex-1 px-3 py-2 bg-gray-50 focus:outline-none"
                            readOnly
                        />
                    </div>
                </div>

                <AirportAutocompleteInput
                    name="Cambiar Aeropuerto Favorito"
                    placeHolder="Buscar aeropuerto..."
                    onAirportSelect={handleAirportSelect}
                    selectedAirport={selectedAirport}
                />

                {selectedAirport && (
                    <div className="form-group">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                                <strong>Nuevo aeropuerto seleccionado:</strong> {selectedAirport.name} - {selectedAirport.city} ({selectedAirport.iata})
                            </p>
                        </div>
                    </div>
                )}
                
                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Guardando...
                        </div>
                    ) : (
                        "Guardar Cambios"
                    )}
                </button>
            </form>
        </div>
    );
}

export default PersonalDataForm;
