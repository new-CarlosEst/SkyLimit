import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"
import { useState } from "react";

type AuthModalProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function AuthModal({isOpen, setIsOpen} : AuthModalProps){
    const [isLogin, setIsLogin] = useState(true)
    
    if (!isOpen){ return null }
    return(
        <>
            <button onClick={() => setIsOpen(false)}>X</button>
            <LoginForm isLogin={isLogin} setIsLogin={setIsLogin}/>
            <RegisterForm isLogin={isLogin} setIsLogin={setIsLogin}/>
        </>
)}

export default AuthModal