import "./HeroLanding.css";
import SearchCard from "../../flights/flightSearch/SearchCard";


function HeroLanding() {
    return (
        <div className="hero bg-linear-to-br from-[#2c5aa0] to-[#1e3a6f]">
            <h1 className="text-white text-6xl font-bold my-4">Vuela con Nosotros</h1>
            <h2 className="text-blue-200 text-2xl mb-2">Descubre el mundo sin límites</h2>
            <h3 className="text-blue-200 text-lg mb-8">Encuentra los mejores precios para tu vuelos. Compara, consulta y viaja con nosotros</h3>
            <SearchCard />
        </div>


    )
}

export default HeroLanding;