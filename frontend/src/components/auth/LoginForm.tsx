import { useState } from "react";
import { login } from "../../api/auth.api";
import type { LoginData } from "../../api/types";
import AuthButton from "./AuthButton";
import ChangeAuthBtn from "./ChangeAuthBtn";
import MailInput from "./MailInput";
import PasswordInput from "./PasswordInput";
import "./LoginForm.css";

// Import logo
import logo from "../../assets/logo/logo-skylimit-letters-blue-rounded.svg";

function LoginForm({ setIsLogin }: { setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [error, setError] = useState<string | null>(null);

    const enviarDatos = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget)
        const datos: LoginData = {
            email: formData.get("email") as string,
            password: formData.get("password") as string
        }

        login(datos)
            .then(res => console.log(res.data))
            .catch(err => {
                const message = err.response?.data?.message || "Error al iniciar sesión";
                setError(Array.isArray(message) ? message[0] : message);
            })
    }

    return (
        <div className="login-form-container">
            <div className="image-side">
                <div className="go-to-register">
                    <h2 className="text-white text-4xl font-extrabold">¡Hola de nuevo!</h2>
                    <p className="text-white text-lg font-medium">¿Aun no tienes cuenta?</p>
                    <ChangeAuthBtn setIsLogin={setIsLogin} text="Regístrate" />
                </div>
            </div>
            <div className="form-side">
                <img src={logo} alt="Logo-skylimit" className="logo-skylimit" />
                <p className="text-gray-600 text-sm font-bold text-center mb-10 max-w-[250px]">
                    Inicia sesión para gestionar tus vuelos
                </p>
                <form onSubmit={enviarDatos} className="form-login-content">
                    <MailInput />
                    <PasswordInput />
                    <div className="flex justify-between items-center w-full mt-2 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" name="remember" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                            <span className="text-gray-600 text-sm font-medium group-hover:text-blue-600 transition-colors">Recuérdame</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">¿Has olvidado tu contraseña?</a>
                    </div>
                    {error && (
                        <p className="text-red-500 text-xs font-semibold mb-3 bg-red-50 p-2 rounded border border-red-100 animate-shake">
                            {error}
                        </p>
                    )}
                    <AuthButton text="Iniciar Sesión" />
                </form>
            </div>
        </div>
    )
}

export default LoginForm;