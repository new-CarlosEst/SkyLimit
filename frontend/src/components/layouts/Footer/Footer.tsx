import logo from "../../../assets/logo/logo-skylimit-letters-white-rounded.svg";

function Footer() {
    return (
        <footer className="flex flex-col items-center gap-5 bg-linear-to-bl from-[#1e3a6f] to-[#2c5aa0] text-gray-200 py-10">
            <img className="h-16" src={logo} alt="Logo" />
            <p className="text-center w-1/2">Comprometidos con la transparencia en la búsqueda y compra de vuelos. Porque viaje deberia ser emocionante, no frustrante.</p>
            <p className="text-sm">Skylimit S.L. © 2026. Todos los derechos reservados.</p>
        </footer>
    )
}

export default Footer;