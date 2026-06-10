/**
 * Valida si un email tiene un formato correcto.
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida si un DNI/NIE de España tiene un formato y dígito de control correcto.
 */
export const isValidDNI = (dni: string): boolean => {
    const cleanDni = dni.trim().toUpperCase().replace(/[\s-]/g, "");
    
    // DNI: 8 números + 1 letra
    // NIE: X, Y o Z + 7 números + 1 letra
    const dniRegex = /^\d{8}[A-Z]$/;
    const nieRegex = /^[XYZ]\d{7}[A-Z]$/;
    
    if (!dniRegex.test(cleanDni) && !nieRegex.test(cleanDni)) {
        return false;
    }

    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    let numberStr = cleanDni.slice(0, -1);
    
    // Reemplazar la letra inicial del NIE por su valor numérico correspondiente
    if (cleanDni.startsWith('X')) {
        numberStr = '0' + numberStr.slice(1);
    } else if (cleanDni.startsWith('Y')) {
        numberStr = '1' + numberStr.slice(1);
    } else if (cleanDni.startsWith('Z')) {
        numberStr = '2' + numberStr.slice(1);
    }
    
    const parsedNumber = parseInt(numberStr, 10);
    const expectedLetter = letters[parsedNumber % 23];
    const actualLetter = cleanDni.slice(-1);
    
    return expectedLetter === actualLetter;
};

/**
 * Valida si un pasaporte tiene un formato básico correcto.
 * Habitualmente, entre 6 y 15 caracteres alfanuméricos.
 */
export const isValidPassport = (passport: string): boolean => {
    const cleanPassport = passport.trim();
    const passportRegex = /^[A-Z0-9]{6,15}$/i;
    return passportRegex.test(cleanPassport);
};

/**
 * Valida un documento según sea DNI o pasaporte.
 */
export const isValidDocument = (type: string, number: string): boolean => {
    if (type === 'DNI') {
        return isValidDNI(number);
    }
    if (type === 'PASSPORT') {
        return isValidPassport(number);
    }
    return number.trim().length > 0;
};
