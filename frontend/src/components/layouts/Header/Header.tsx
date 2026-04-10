import { useState } from "react";
import fullLogoWhite from "../../../assets/logo/logo-skylimit-letters-white-rounded.svg";
import "./Header.css";
import AuthModal from "../../auth/AuthModal";

function Header() {

    //TODO: Ver si meter este estado en zustand para evitar el prop drilling
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <div className="header">
            <img src={fullLogoWhite} alt="Logo-skylimit" />
            <nav className="navigation">
                <ul>
                    <li>Inicio</li>
                    <li>Ofertas</li>
                    <li>Destinos</li>
                    <li>Blog</li>
                    <li>Contacto</li>
                </ul>
            </nav>
            <div className="session-actions">
                <button
                    className="login-button bg-white text-[#2c5aa0] py-2 px-6 rounded-lg mr-6 font-semibold hover:bg-blue-200 transition-colors"
                    onClick={() => setIsAuthModalOpen(true)}
                >
                    Iniciar Sesión
                </button>
            </div>

            <AuthModal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen} />
        </div>
    )
}

export default Header;