import planeIcon from "../../../../assets/ui/MynauiPlane.svg";
import { formatMinutesToHours, formatToShortTime } from "../../../../utils/formaters";

// Función para formatear el nombre de la clase de cabina
function formatCabinClass(cabinClass: string | null): string {
    if (!cabinClass) return 'Economy';
    const formatMap: Record<string, string> = {
        'economy': 'Economy',
        'premiumeconomy': 'Premium Economy',
        'business': 'Business',
        'first': 'First'
    };
    return formatMap[cabinClass] || 'Economy';
}

function LegData(
    props:{
        airline : string;
        airlineLogo : string;
        duration: number;
        stops: number;
        originCity: string;
        destinationCity: string;
        originIata: string;
        destinationIata: string;
        departureTime: string;
        arrivalTime: string;
        cabinClass: 'economy' | 'premiumeconomy' | 'business' | 'first' | null;
    }
) {
    
    return (
        <div className="flex flex-col gap-4 mx-20">
            <div className="flex items-center gap-3">
                <img src={props.airlineLogo} alt={props.airline} className="w-6 h-6" />
                <p className="text-sm text-gray-600">{props.airline}</p>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                    {formatCabinClass(props.cabinClass)}
                </span>
            </div>

            <div className="flex items-center justify-between">
                {/* Origen - Izquierda */}
                <div className="text-left">
                    <p className="text-3xl font-semibold text-gray-900">{formatToShortTime(props.departureTime)}</p>
                    <p className="text-lg font-medium text-gray-700">{props.originIata}</p>
                    <p className="text-sm text-gray-500">{props.originCity}</p>
                </div>

                {/* Centro - Duración y línea */}
                <div className="flex flex-col items-center flex-1 px-6">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                        {formatMinutesToHours(props.duration)}
                    </div>
                    <div className="flex items-center w-full">
                        <div className="flex-1 h-px bg-gray-400"></div>
                        <img src={planeIcon} alt="plane" className="w-5 h-5 mx-2" />
                        <div className="flex-1 h-px bg-gray-400"></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {props.stops === 0 ? "Sin escalas" : `${props.stops} escala${props.stops > 1 ? 's' : ''}`}
                    </div>
                </div>

                {/* Destino - Derecha */}
                <div className="text-right">
                    <p className="text-3xl font-semibold text-gray-900">{formatToShortTime(props.arrivalTime)}</p>
                    <p className="text-lg font-medium text-gray-700">{props.destinationIata}</p>
                    <p className="text-sm text-gray-500">{props.destinationCity}</p>
                </div>
            </div>
        </div>
    );
}

export default LegData;