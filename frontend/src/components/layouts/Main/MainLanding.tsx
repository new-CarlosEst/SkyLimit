import shield from "../../../assets/ui/UilShield.svg";
import chartDown from "../../../assets/ui/MaterialSymbolsTrendingDown.svg";
import plane from "../../../assets/ui/MynauiPlane.svg";

function MainLanding() {
    return (
        <main className="bg-white mt-16 w-full">
            {/* Encabezado */}
            <div className="text-center my-12">
                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                    ¿Qué ofrecemos?
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Una experiencia de búsqueda de vuelos diseñada con transparencia en mente
                </p>
            </div>

            {/* Tarjetas */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto my-16">
                {/* Tarjeta 1: Búsqueda transparente */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-[#1e3a6f] w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                        <img src={shield} alt="Shield" className="w-8 h-8 filter brightness-0 invert" />
                    </div>
                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                        Búsqueda transparente
                    </h5>
                    <p className="text-gray-600 leading-relaxed">
                        Consulta vuelos sin preocuparte por técnicas de manipulación de precios basadas en tu actividad.
                    </p>
                </div>

                {/* Tarjeta 2: Precios estables */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-[#1e3a6f] w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                        <img src={chartDown} alt="Chart Down" className="w-8 h-8 filter brightness-0 invert" />
                    </div>
                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                        Precios estables
                    </h5>
                    <p className="text-gray-600 leading-relaxed">
                        Evitamos la volatilidad artificial para que puedas tomar decisiones con confianza.
                    </p>
                </div>

                {/* Tarjeta 3: Comparación justa */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-[#1e3a6f] w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                        <img src={plane} alt="Plane" className="w-8 h-8 filter brightness-0 invert" />
                    </div>
                    <h5 className="text-xl font-bold text-gray-900 mb-3">
                        Comparación justa
                    </h5>
                    <p className="text-gray-600 leading-relaxed">
                        Compara opciones sabiendo que los precios reflejan la realidad del mercado, no tu historial de navegación.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default MainLanding;