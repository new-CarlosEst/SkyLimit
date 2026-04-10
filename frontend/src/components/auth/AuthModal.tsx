import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"
import { useState } from "react";
import "./AuthModal.css";


function AuthModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [isLogin, setIsLogin] = useState(true);

    if (!isOpen) return null;

    //TODO: Cambiar los errores de cliente o servidor que salen arriba del boton de enviar por un toast/alert de Sileo
    return (
        <div className="auth-modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className={`auth-slider ${isLogin ? 'show-login' : 'show-register'}`}>
                    <div className="auth-panel">
                        <RegisterForm setIsLogin={setIsLogin} />
                    </div>
                    <div className="auth-panel">
                        <LoginForm setIsLogin={setIsLogin} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthModal