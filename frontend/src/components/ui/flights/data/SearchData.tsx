import { useSearchParamsStore } from "../../../../store/searchParamsStore";
import locationIcon from "../../../../assets/ui/ProiconsLocation.svg";
import calendarIcon from "../../../../assets/ui/IconoirCalendar.svg";
import planeIcon from "../../../../assets/ui/MynauiPlane.svg";
import { formatDate, formatCabinClass, formatTripType} from "../../../../utils/formaters";
import { useNavigate } from "react-router-dom";

function SearchData(
    { tripType }: { tripType: "oneWay" | "roundTrip" | "multi" | null }
) {
    const navigate = useNavigate();

    //Saco los datos de la store de zustand que guarda los datos de busqueda
    const { originIata, destinationIata, departureDate, returnDate, passengers, cabinClass } = useSearchParamsStore();

    return (
        <div className="mt-22 mb-6 mx-6 shadow-lg border border-gray-100 rounded-lg px-6 py-6 flex justify-between items-center gap-8">
            <div className="flex flex-row gap-3 flex-1">

                {/* Div con iata de salida y de llegada */}
                <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-center text-gray-800">
                    <img src={locationIcon} alt="location" className="text-[#2c5aa0]"
                        style={{ filter: 'brightness(0) saturate(100%) invert(22%) sepia(76%) saturate(2878%) hue-rotate(211deg) brightness(93%) contrast(91%)' }}
                    />
                    <span>{originIata} → {destinationIata}</span>
                </div>

                {/* Div con la fecha de salida */}
                <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-center text-gray-800">
                    <img src={calendarIcon} alt="calendar" className="text-[#2c5aa0]"
                        style={{ filter: 'brightness(0) saturate(100%) invert(22%) sepia(76%) saturate(2878%) hue-rotate(211deg) brightness(93%) contrast(91%)' }}
                    />
                    <span>{formatDate(departureDate)}</span>
                </div>

                {/* Div con la fecha de regreso */}
                {returnDate && (
                    <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-center text-gray-800">
                        <img src={calendarIcon} alt="calendar" className="text-[#2c5aa0]"
                            style={{ filter: 'brightness(0) saturate(100%) invert(22%) sepia(76%) saturate(2878%) hue-rotate(211deg) brightness(93%) contrast(91%)' }}
                        />
                        <span>{formatDate(returnDate)}</span>
                    </div>
                )}

                {/* Div con el numero de pasajeros */}
                <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-center text-gray-800">
                    <img src={planeIcon} alt="plane" className="text-[#2c5aa0]"
                        style={{ filter: 'brightness(0) saturate(100%) invert(22%) sepia(76%) saturate(2878%) hue-rotate(211deg) brightness(93%) contrast(91%)' }}
                    />
                    <span>{(passengers?.adults || 0) + (passengers?.children || 0) + (passengers?.infants || 0)} pasajeros</span>
                    <span> • </span>
                    <span>{formatCabinClass(cabinClass)}</span>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-center text-gray-800">
                    <span>{formatTripType(tripType)}</span>
                </div>
            </div>

            <div className="shrink-0">
                <button
                    className="
                        border-2 border-[#2c5aa0] rounded-lg text-[#2c5aa0] bg-transparent px-4 py-2 font-semibold 
                        hover:bg-[#2c5aa0] hover:text-white hover:scale-110 transition-all duration-200 
                    "
                    onClick={() => { navigate("/"); }}
                >
                    Modificar búsqueda
                </button>
            </div>
        </div>
    );
}

export default SearchData;
