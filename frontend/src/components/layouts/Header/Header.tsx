import { useState } from "react";
import fullLogoWhite from "../../../assets/logo/logo-skylimit-letters-white-rounded.svg";
import "./Header.css";
import AuthModal from "../../auth/AuthModal";
import { useAuthStore } from "../../../store/authStore";
import UserButton from "../../ui/header/UserButton";
import { Link } from "react-router-dom";

function Header() {

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { user } = useAuthStore();

    return (
        <div className="header">
            <img src={fullLogoWhite} alt="Logo-skylimit" />
            <nav className="navigation">
                <ul>
                    {/* TODO: Meter los enlaces en rutas de react-router cuando tenga las paginas */}
                    <li><Link to="/">Inicio</Link></li>
                    <li>Vuelos</li>
                    <li>Destinos</li>
                    <li><Link to="/blog">Blog</Link></li>
                    <li>Contacto</li>
                </ul>
            </nav>
            <div className="session-actions">
                {/* Veo si hay iniciado sesion, en caso de que no muestro el boton de iniciar sesion,  */}
                {user ? (
                    <UserButton user={user} />
                ) : (
                    <button
                        className="login-button bg-white text-[#2c5aa0] py-2 px-6 rounded-lg mr-6 font-semibold hover:bg-blue-200 transition-colors"
                        onClick={() => setIsAuthModalOpen(true)}
                    >
                        Iniciar Sesión
                    </button>
                )}
            </div>

            <AuthModal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen} />
        </div>
    )
}

export default Header;