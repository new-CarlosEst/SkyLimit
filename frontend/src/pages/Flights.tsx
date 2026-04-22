import { useFlightSearchStore } from "../store/flightSearchStore";
import { useSearchParamsStore } from "../store/searchParamsStore";
import SearchData from "../components/ui/flights/data/SearchData";
import FilterSidebar from "../components/flights/filter/FilterSidebar";
import FlightCard from "../components/flights/data/FlightCard";
import upDownArrow from "../assets/ui/upDownArrow.svg";
import paperPlane from "../assets/ui/FaPaperPlane.svg";

//Pagina que contendra los vuelos buscado y sus datos
function Flights() {
    const { results, tripType } = useFlightSearchStore();
    const { cabinClass } = useSearchParamsStore();

    const numVuelos = results?.length ?? 0;
    return (
        <div className="mt-16">
            <SearchData  tripType={tripType} />
            <div className="my-4 mx-8 flex justify-between items-center">
                <p className="text-lg text-gray-600">
                    Vuelos encontrados: <span className="font-bold text-[#4f79c4]">{numVuelos}</span>
                </p>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <img src={upDownArrow} alt="Ordenar" className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-700">Ordenar</span>
                </button>
            </div>
            {numVuelos == 0 ? (
                <div className="text-center py-12">
                    <p className="text-4xl font-bold text-[#2c5aa0]">Oops...</p>
                    <p className="text-gray-500 text-xl py-4">Parece que no se encontraron vuelos para los criterios de búsqueda seleccionados.</p>
                    <img src={paperPlane} alt="No flights" className="absolute left-1/2 transform -translate-x-1/2 opacity-10 w-48 h-48" />
                </div>
            ) : (
                <div className="flights-container flex gap-4 px-8">
                    <FilterSidebar />
                    <div className="ml-16 results flex-3 transition-all duration-500 ease-in-out w-full">
                        <div className="results-container flex flex-col gap-4">
                            {results && results.map((flight) => (
                                <FlightCard key={flight.id} flight={flight} cabinClass={cabinClass} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Flights;