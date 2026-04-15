import { useState } from "react";
import { register } from "../../api/auth.api";
import type { RegisterData } from "../../types/auth.types";
import AuthButton from "../ui/auth/AuthButton";
import "./RegisterForm.css";
import ChangeAuthBtn from "./ChangeAuthBtn";
import MailInput from "../ui/auth/MailInput";
import PasswordInput from "../ui/auth/PasswordInput";
import TextInput from "../ui/auth/TextInput";
import { sileo } from "sileo";
import { useAuthStore } from "../../store/authStore";

// Import logo
import logo from "../../assets/logo/logo-skylimit-letters-blue-rounded.svg";

function RegisterForm(
    { setView, setIsOpen }:
        { setView: React.Dispatch<React.SetStateAction<'login' | 'register' | 'forgot'>>, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }
) {

    const [error, setError] = useState<string | null>(null);

    const enviarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget)
        const datos: RegisterData = {
            name: formData.get("name") as string,
            surname: formData.get("surname") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string
        }

        register(datos)
            .then(res => {
                const token = res.data.access_token;
                useAuthStore.getState().login(res.data.user, token);

                // Guardamos la sesión en el sessionStorage
                sessionStorage.setItem("auth-storage", JSON.stringify({
                    state: {
                        token: token
                    },
                }));

                sileo.success({ title: "Registro completado con éxito" });
                setIsOpen(false);
            })
            .catch(err => {
                const message = err.response?.data?.message || err.message || "Error al registrarse";
                const errorString = Array.isArray(message) ? message[0] : message;

                sileo.error({
                    title: "Error de autenticación",
                    description: typeof errorString === 'string' ? errorString : "Verifica los datos",
                });
            })
    }

    return (
        <div className="register-form-container">
            <div className="form-side">
                <img src={logo} alt="Logo-skylimit" className="logo-skylimit" />
                <p className="text-gray-600 text-sm font-bold text-center mb-10 max-w-[250px]">
                    Comienza tu aventura con nosotros
                </p>
                <form onSubmit={enviarDatos} className="form-login-content">
                    <div className="flex gap-4 w-full">
                        <TextInput label="Nombre" name="name" placeholder="Tu nombre..." />
                        <TextInput label="Apellidos" name="surname" placeholder="Tus apellidos..." />
                    </div>
                    <MailInput />
                    <PasswordInput />
                    {error && (
                        <p className="text-red-500 text-xs font-semibold mb-1 bg-red-50 p-2 rounded border border-red-100 animate-shake">
                            {error}
                        </p>
                    )}
                    <AuthButton text="Registrarse" />
                </form>
            </div>
            <div className="image-side">
                <div className="go-to-login">
                    <h2 className="text-white text-4xl font-extrabold">¡Únete ahora!</h2>
                    <p className="text-white text-lg font-medium">¿Ya tienes cuenta?</p>
                    <ChangeAuthBtn onClick={() => setView('login')} text="Inicia Sesión" />
                </div>
            </div>
        </div>
    )
}

export default RegisterForm;
