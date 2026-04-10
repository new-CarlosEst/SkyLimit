import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"
import { useState } from "react";
import "./AuthModal.css";
import AuthButton from "./AuthButton";

// Import backgrounds
import loginBg from "../../assets/backgrounds/Login-Avion-azul.jpg";
import registerBg from "../../assets/backgrounds/Register-Pasaporte-azul.jpg";

function AuthModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [isLogin, setIsLogin] = useState(true)

    if (!isOpen) { return null }

    return (
        <>
        </>
    )
}

export default AuthModal