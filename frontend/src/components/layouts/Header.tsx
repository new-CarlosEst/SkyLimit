// Importo el el boton de login 
import AuthButton from "../auth/AuthButton";
import { useState } from "react";
import AuthModal from "../auth/AuthModal";

//TODO: Esto va en app.tsx pero el modal tambien tien que ir fuera
//TODO: Cuando ya vayan los enpoints del back mover este componente a la landing o donde lo necesite
function Header(){
    //TODO: Tener en cuenta si migrar este estado en un futuro a stateStore de Zustand
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
        <>
            <nav className="header">
                <AuthButton setIsOpen={setIsOpen} />
            </nav>
            <AuthModal isOpen={isOpen} setIsOpen={setIsOpen}/>
        </>
    )
}

export default Header;