// Importo el el boton de login 
import AuthButton from "../auth/AuthButton";

//TODO: Esto va en app.tsx pero el modal tambien tien que ir fuera
//TODO: Cuando ya vayan los enpoints del back mover este componente a la landing o donde lo necesite
function Header(){
    return (
        <nav className="header">
            <AuthButton/>
        </nav>
    )
}

export default Header;