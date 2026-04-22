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
            return 'Turista premium';
        case 'BUSINESS':
            return 'Ejecutiva';
        case 'FIRST':
            return 'Primera clase';
        default:
            return cabinClass;
    }
};