import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"
import { useState } from "react";
import "./AuthModal.css";
import ForgotPassword from "./ForgotPassword";


function AuthModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className={`auth-slider show-${view}`}>
                    <div className="auth-panel">
                        <RegisterForm setView={setView} setIsOpen={setIsOpen} />
                    </div>
                    <div className="auth-panel">
                        <LoginForm setView={setView} setIsOpen={setIsOpen} />
                    </div>
                    <div className="auth-panel">
                        <ForgotPassword setView={setView} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthModal