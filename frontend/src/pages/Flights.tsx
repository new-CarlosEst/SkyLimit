import { useFlightSearchStore } from "../store/flightSearchStore";
import { useSearchParamsStore } from "../store/searchParamsStore";
import { useFilterStore } from "../store/filterStore";
import SearchData from "../components/ui/flights/data/SearchData";
import FilterSidebar from "../components/flights/filter/FilterSidebar";
import FlightCardAnimated from "../components/flights/data/FlightCardAnimated";
import OrderButton from "../components/flights/filter/OrderButton";
import paperPlane from "../assets/ui/FaPaperPlane.svg";

//Pagina que contendra los vuelos buscado y sus datos
function Flights() {
    const { results, tripType, getSortedResults } = useFlightSearchStore();
    const { cabinClass, passengers } = useSearchParamsStore();
    const { getFilteredResults } = useFilterStore();

    const sortedResults = getSortedResults();
    const filteredResults = getFilteredResults(sortedResults || []);
    const numVuelos = filteredResults?.length ?? 0;
    return (
        <div className="mt-16 min-h-screen">
            <SearchData  tripType={tripType} />
            <div className="my-4 mx-8 flex justify-between items-center">
                <p className="text-lg text-gray-600">
                    Vuelos encontrados: <span className="font-bold text-[#4f79c4]">{numVuelos}</span>
                </p>
                <OrderButton />
            </div>
            <div className="flights-container flex gap-4 px-8">
                <FilterSidebar tripType={tripType} />
                <div className="ml-16 results flex-3 transition-all duration-500 ease-in-out w-full">
                    {numVuelos == 0 ? (
                        <div className="text-center py-12 min-h-[60vh] flex flex-col justify-center items-center relative">
                            <p className="text-4xl font-bold text-[#2c5aa0]">Oops...</p>
                            <p className="text-gray-500 text-xl py-4">Parece que no se encontraron vuelos para los criterios de búsqueda seleccionados.</p>
                            <img src={paperPlane} alt="No flights" className="absolute left-1/2 transform -translate-x-1/2 opacity-10 w-48 h-48" />
                        </div>
                    ) : (
                        <div className="results-container flex flex-col gap-4 pb-16">
                            {/* todo: En caso de que sea multiples destinos, en la card mostrar las 2 primeras trips y en los demas mostrar un boton de "ver mas" para que la card no sea enorme */}
                            {filteredResults && filteredResults.map((flight, index) => (
                                <FlightCardAnimated 
                                    key={flight.id} 
                                    flight={flight} 
                                    cabinClass={cabinClass} 
                                    passengers={passengers}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Flights;