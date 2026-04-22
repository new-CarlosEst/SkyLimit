//Este archivo tendra todos los formateadores de datos  

//Función que formatea la fecha
export const formatDate = (date: string | null) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
};

//Función que formatea la clase de la cabina a español
export const formatCabinClass = (cabinClass: string | null) => {
    if (!cabinClass) return '';
    switch (cabinClass.toUpperCase()) {
        case 'ECONOMY':
            return 'Turista';
        case 'PREMIUM_ECONOMY':
        case 'PREMIUMECONOMY':
        case 'PREMIUM ECONOMY':
            return 'Turista premium';
        case 'BUSINESS':
            return 'Ejecutiva';
        case 'FIRST':
            return 'Primera clase';
        default:
            return cabinClass;
    }
};

//Función que formatea el tipo de viaje a español
export const formatTripType = (tripType: string | null) => {
    if (!tripType) return '';
    switch (tripType.toLowerCase()) {
        case 'oneway':
            return 'Ida';
        case 'roundtrip':
            return 'Ida y vuelta';
        case 'multi':
            return 'Múltiples destinos';
        default:
            return tripType;
    }
};

//Funcion que pasa la duracion de minutos a horas
export const formatMinutesToHours = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
};

//funcion que pasa una datatime de horas, minutos y segundos con dias, mes y año a solo dia y hora
export const formatToShortTime = (dateTime: string) => {
    let dateTimeSplit = dateTime.split("T");
    let time = dateTimeSplit[1].split(":");
    return `${time[0]}:${time[1]}`;
};

