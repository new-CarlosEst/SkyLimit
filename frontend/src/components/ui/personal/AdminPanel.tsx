import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { registerAdmin } from "../../../api/auth.api";
import { sileo } from "sileo";
import FlightCreationForm from "../admin/FlightCreationForm";
import "../../../pages/AdminPanel.css";

function AdminPanel() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { user } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await registerAdmin(email);
            sileo.success({ title: response.data.message });
            setEmail("");
        } catch (err: any) {
            const statusCode = err.response?.status;
            let title = "Error al registrar administrador";
            let description = "Verifica el correo e inténtalo de nuevo";
            
            if (statusCode === 401) {
                title = "Este usuario ya es administrador";
                description = "El usuario ya tiene rol de administrador o superadministrador";
            } else if (statusCode === 404) {
                title = "Este usuario no existe";
                description = "No hay ningún usuario registrado con este correo electrónico";
            }
            
            sileo.error({
                title: title,
                description: description
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 className="card-title">Panel de Administración</h2>
            <p className="text-gray-600">Panel de administración</p>
            
            {user?.role === 'SUPERADMIN' && (
                <div className="admin-form-container">
                    <h3 className="admin-form-title">Asignar Rol de Administrador</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Correo electrónico del usuario:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="usuario@ejemplo.com"
                                required
                            />
                        </div>
                        
                                                
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? "Procesando..." : "Asignar Rol Admin"}
                        </button>
                    </form>
                </div>
            )}
            
            {/* Formulario de creación de vuelos para ADMIN y SUPERADMIN */}
            {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
                <div className="admin-form-container" style={{ marginTop: '2rem' }}>
                    <FlightCreationForm />
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
