import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import { resetPassword } from "../api/auth.api";
import { useValidatePasswordToken } from "../hooks/useValidatePasswordToken"; // 👈 importa el hook
import PasswordInput from "../components/ui/auth/PasswordInput";
import AuthButton from "../components/ui/auth/AuthButton";
import logo from "../assets/logo/logo-skylimit-letters-blue-rounded.svg";
import "./PasswordRecovery.css";

function PasswordRecovery() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // 👇 Usa el hook personalizado
    const { isValidating, isValid } = useValidatePasswordToken(token);

    const enviarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (!token) {
            setError("Token no válido");
            return;
        }

        resetPassword(token, password)
            .then(() => {
                sileo.success({ title: "Contraseña actualizada con éxito" });
                setSuccess(true);
                setTimeout(() => {
                    navigate("/");
                }, 5000);
            })
            .catch(err => {
                const message = err.response?.data?.message || "Error al actualizar la contraseña";
                const errorString = Array.isArray(message) ? message[0] : message;

                sileo.error({
                    title: "Error al actualizar la contraseña",
                    description: typeof errorString === 'string' ? errorString : "Inténtalo de nuevo",
                });
            });
    };

    // Mostrar un loader mientras se valida
    if (isValidating) {
        return (
            <div className="password-recovery-container">
                <div className="form-wrapper">
                    <img src={logo} alt="Logo-skylimit" className="logo-skylimit" />
                    <p className="text-gray-600 text-sm font-bold text-center mb-10">
                        Validando enlace...
                    </p>
                </div>
            </div>
        );
    }

    // Si el token no es válido, no renderiza nada (el hook ya redirige)
    if (!isValid) {
        return null;
    }

    return (
        <div className="password-recovery-container">
            <div className="form-wrapper">
                <img src={logo} alt="Logo-skylimit" className="logo-skylimit" />
                <p className="text-gray-600 text-sm font-bold text-center mb-10 max-w-[250px]">
                    Introduce tu nueva contraseña
                </p>
                {!success ? (
                    <form onSubmit={enviarDatos} className="form-login-content">
                        <PasswordInput />
                        <div className="flex flex-col gap-1 w-full">
                            <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                                Confirmar contraseña
                            </label>
                            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 sm:py-3.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all bg-white group">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirma tu contraseña..."
                                    className="outline-none text-gray-700 text-sm bg-transparent placeholder-gray-500 font-medium text-left w-full h-full"
                                />
                            </div>
                        </div>
                        {error && (
                            <p className="text-red-500 text-xs font-semibold mb-1 bg-red-50 p-2 rounded border border-red-100">
                                {error}
                            </p>
                        )}
                        <AuthButton text="Actualizar contraseña" />
                    </form>
                ) : (
                    <div className="form-login-content text-center">
                        <p className="text-green-600 text-lg font-semibold mb-4">¡Contraseña actualizada correctamente!</p>
                        <p className="text-gray-600 text-sm mb-6">Serás redirigido a la página principal en 5 segundos...</p>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors"
                        >
                            Volver a la página principal ahora
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PasswordRecovery;