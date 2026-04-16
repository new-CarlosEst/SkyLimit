import "./ForgotPassword.css";
import logo from "../../assets/logo/logo-skylimit-letters-blue-rounded.svg";
import { forgotPassword } from "../../api/auth.api";
import MailInput from "../ui/auth/MailInput";
import AuthButton from "../ui/auth/AuthButton";
import ChangeAuthBtn from "./ChangeAuthBtn";
import { sileo } from "sileo";

function ForgotPassword({ setView }: { setView: React.Dispatch<React.SetStateAction<'login' | 'register' | 'forgot'>> }) {

    const enviarDatos = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        forgotPassword(email)
            .then(res => {
                sileo.success({ title: "Correo enviado correctamente" });
                console.log(res);
            })
            .catch(err => {
                const message = err.response?.data?.message || "Error al enviar el correo";
                const errorString = Array.isArray(message) ? message[0] : message;

                sileo.error({
                    title: "Error al enviar el correo",
                    description: typeof errorString === 'string' ? errorString : "Por favor, verifica el correo e inténtalo de nuevo"
                });
                console.log(err);
            });
    }
    return (
        <div className="forgot-password-form-container">
            <div className="form-side">
                <img src={logo} alt="Logo-skylimit" className="logo-skylimit" />
                <p className="text-gray-600 text-sm font-bold text-center mb-10 max-w-[250px]">
                    ¿Te has olvidado de tu contraseña?
                </p>
                <form onSubmit={enviarDatos} className="form-login-content">
                    <MailInput name="Introduce el correo electronico asociado a tu cuenta" />
                    <AuthButton text="Enviar correo" />
                </form>
            </div>
            <div className="image-side">
                <div className="go-to-login">
                    <h2 className="text-white text-4xl font-extrabold">¿Todo listo para volver?</h2>
                    <p className="text-white text-lg font-medium">Inicia sesión de nuevo</p>
                    <ChangeAuthBtn onClick={() => setView('login')} text="Inicia sesión" />
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;
