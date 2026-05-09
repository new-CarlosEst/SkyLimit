import { sileo } from "sileo";
import "../../../pages/AdminPanel.css";
import PajamasAdmin from "../../../assets/ui/PajamasAdmin.svg";
import mail from "../../../assets/ui/mail.svg";
import padlock from "../../../assets/ui/padlock.svg";
import ProiconsPerson from "../../../assets/ui/ProiconsPerson.svg";
import HugeiconsAirport from "../../../assets/ui/HugeiconsAirport.svg";

function AdminUserForm() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sileo.success({ title: "Usuario administrador creado correctamente" });
    };

    return (
        <div className="card">
            <h2 className="card-title">Crear Usuario Administrador</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                            placeholder="admin@ejemplo.com"
                            className="flex-1 px-3 py-2 focus:outline-none"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Se enviará un correo de bienvenida al usuario</p>
                </div>

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
                                placeholder="Juan"
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
                                placeholder="Pérez García"
                                className="flex-1 px-3 py-2 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Rol del Usuario
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <div className="p-2 border-r border-gray-300">
                            <img src={PajamasAdmin} alt="Role" className="w-5 h-5" />
                        </div>
                        <select className="flex-1 px-3 py-2 focus:outline-none">
                            <option value="ADMIN">Administrador</option>
                            <option value="SUPERADMIN">Superadministrador</option>
                        </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        ADMIN: Gestión básica | SUPERADMIN: Control total del sistema
                    </p>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Contraseña Temporal
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <div className="p-2 border-r border-gray-300">
                            <img src={padlock} alt="Password" className="w-5 h-5" />
                        </div>
                        <input
                            type="password"
                            placeholder="Dejar en blanco para generar automáticamente"
                            className="flex-1 px-3 py-2 focus:outline-none"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Si se deja en blanco, se generará una contraseña segura automáticamente
                    </p>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Aeropuerto Favorito (Opcional)
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <div className="p-2 border-r border-gray-300">
                            <img src={HugeiconsAirport} alt="Airport" className="w-5 h-5" />
                        </div>
                        <input
                            type="number"
                            placeholder="ID del aeropuerto favorito"
                            className="flex-1 px-3 py-2 focus:outline-none"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        ID numérico del aeropuerto (opcional)
                    </p>
                </div>
                
                <button
                    type="submit"
                    className="submit-button"
                >
                    <div className="flex items-center justify-center">
                        <img src={PajamasAdmin} alt="Admin" className="w-5 h-5 mr-2" />
                        Crear Administrador
                    </div>
                </button>
            </form>
        </div>
    );
}

export default AdminUserForm;
