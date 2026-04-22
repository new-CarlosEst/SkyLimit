import { useFlightSearchStore } from "../store/flightSearchStore";
import SearchData from "../components/ui/flights/data/SearchData";


//Pagina que contendra los vuelos buscado y sus datos
function Flights() {
    //const { results, tripType } = useFlightSearchStore();
    return (
        <div className="mt-16">
            <SearchData />
        </div>
    );
}

export default Flights;