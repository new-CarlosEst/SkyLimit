import tick from "../../../assets/ui/tickCircle.svg";
import clock from "../../../assets/ui/LucideClock.svg";

function TrustCard() {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">

            {/* Fila de mini-cards */}
            <div className="cards-info">
                {/* Lo que SÍ controlamos — verde */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <img src={tick} alt="tick" className="w-6 h-6 icon-green" />
                        <h3 className="text-base font-semibold text-[#1a3d7a] m-0">Lo que SÍ controlamos</h3>
                    </div>
                    <p className="text-sm text-[#1a3d7a] leading-relaxed m-0">
                        Eliminamos el tracking por cookies y la manipulación de precios basada en tu historial de navegación.
                    </p>
                </div>

                {/* Lo que NO controlamos — azul */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <img src={clock} alt="clock" className="w-6 h-6 icon-blue" />
                        <h3 className="text-base font-semibold text-[#1a3d7a] m-0">Lo que NO controlamos</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed m-0">
                        Los aumentos de precio por parte de las aerolíneas debido a baja disponibilidad o cercanía de la fecha de vuelo.
                    </p>
                </div>
            </div>

            {/* Nuestra promesa */}
            <div className="promise-info">
                <h4>Nuestra promesa</h4>
                <p>
                    No mostramos precios "congelados", sino que evitamos la volatilidad artificial. Si un precio sube, será por razones legítimas de la aerolínea, no por nuestras técnicas de marketing. Así no tendrás sorpresas de último minuto causadas por manipulación de datos.
                </p>
            </div>
        </div>
    );
}

export default TrustCard;
