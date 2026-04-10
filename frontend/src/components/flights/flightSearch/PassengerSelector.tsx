import { useState, useRef, useEffect } from "react";
import peopleIcon from "../../../assets/ui/FormkitPeople.svg";

//Tipos de pasajeros
type PassengerType = "adults" | "children" | "infants";

//Interface para los pasajeros
interface Passengers {
    adults: number;
    children: number;
    infants: number;
}


function PassengerSelector() {

    //Estado para abrir y cerrar el dropdown
    const [open, setOpen] = useState(false);

    //Estado para guardar el numero de pasajeros
    const [passengers, setPassengers] = useState<Passengers>({
        adults: 1, //siempre hay un adulto minimo
        children: 0,
        infants: 0,
    });

    // Creo un referncia con el hook useRef que me va a permitir detectar clicks fuera del componente
    const ref = useRef<HTMLDivElement>(null);

    // Uso el useEffect para detectar clicks fuera del componente
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //Función que se encarga de cambiar el numero de pasajeros, cada vez que se hace click en el boton de sumar o restar
    function change(type: PassengerType, delta: number) {
        setPassengers((prev) => {
            const next = prev[type] + delta;
            const min = type === "adults" ? 1 : 0;
            return { ...prev, [type]: Math.max(min, next) };
        });
    }

    //Calculo el total de pasajeros
    const total = passengers.adults + passengers.children + passengers.infants;
    const label = `${total} ${total === 1 ? "Pasajero" : "Pasajeros"}`;

    //Defino las filas del dropdown
    const rows: { key: PassengerType; title: string; subtitle: string }[] = [
        { key: "adults", title: "Adultos", subtitle: "+12 años" },
        { key: "children", title: "Niños", subtitle: "2 – 11 años" },
        { key: "infants", title: "Infantes", subtitle: "Menos de 2 años" },
    ];

    return (
        <div className="flex flex-col gap-1 text-left relative" ref={ref}>
            {/* Label */}
            <label className="text-xs font-semibold text-gray-600 tracking-wide">
                Pasajeros
            </label>

            {/* Boton que abre el dropdown */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 border border-[#d1daf0] rounded-xl px-3 py-2.5 bg-white transition-all duration-200 hover:border-[#2c5aa0] focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/15 w-full"
            >
                <img src={peopleIcon} alt="passengers" className="w-[18px] h-[18px] opacity-50 shrink-0" />
                <span className="flex-1 text-sm text-left text-gray-800">{label}</span>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {/* Dropdown TODO: Comentar y ver como funciona esto */}
            {open && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex flex-col gap-1">
                        {rows.map(({ key, title, subtitle }) => (
                            <div key={key} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{title}</p>
                                    <p className="text-xs text-gray-400">{subtitle}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => change(key, -1)}
                                        disabled={passengers[key] <= (key === "adults" ? 1 : 0)}
                                        className="w-8 h-8 rounded-full border-2 border-[#2c5aa0] text-[#2c5aa0] font-bold text-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2c5aa0] hover:text-white transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="w-5 text-center text-sm font-semibold text-gray-800">
                                        {passengers[key]}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => change(key, 1)}
                                        className="w-8 h-8 rounded-full border-2 border-[#2c5aa0] text-[#2c5aa0] font-bold text-lg flex items-center justify-center hover:bg-[#2c5aa0] hover:text-white transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Boton que cierra el dropdown */}
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="mt-3 w-full bg-[#2c5aa0] text-white text-sm font-semibold py-2 rounded-xl hover:bg-[#1e3a6f] transition-colors"
                    >
                        Confirmar
                    </button>
                </div>
            )}
        </div>
    );
}

export default PassengerSelector;
