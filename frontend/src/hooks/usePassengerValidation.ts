import { sileo } from "sileo";
import type { PassengerCheckoutData } from "../types/checkout.types";

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateDNI = (dni: string): boolean => {
    const dniRegex = /^\d{8}[A-Za-z]$/;
    return dniRegex.test(dni);
};

export const validatePassport = (passport: string): boolean => {
    const passportRegex = /^[A-Za-z0-9]{6,9}$/;
    return passportRegex.test(passport);
};

export const validatePassengerData = (passengers: PassengerCheckoutData[]): boolean => {
    for (let i = 0; i < passengers.length; i++) {
        const passenger = passengers[i];

        if (!passenger.name || !passenger.surname) {
            sileo.error({
                title: "Faltan datos personales",
            });
            return false;
        }

        if (!passenger.gender) {
            sileo.error({
                title: "Faltan datos personales",
            });
            return false;
        }

        if (!passenger.birthDate) {
            sileo.error({
                title: "Faltan datos personales",
            });
            return false;
        }

        if (!passenger.nationality) {
            sileo.error({
                title: "Faltan datos personales",
            });
            return false;
        }

        if (passenger.type === "Adulto") {
            if (!passenger.email) {
                sileo.error({
                    title: "Faltan datos de contacto",
                });
                return false;
            }

            if (!validateEmail(passenger.email)) {
                sileo.error({
                    title: "Formato de correo incorrecto",
                });
                return false;
            }

            if (!passenger.phone) {
                sileo.error({
                    title: "Faltan datos de contacto",
                });
                return false;
            }
        }

        if (!passenger.document.type) {
            sileo.error({
                title: "Faltan datos del documento",
            });
            return false;
        }

        if (!passenger.document.number) {
            sileo.error({
                title: "Faltan datos del documento",
            });
            return false;
        }

        // Validar formato del documento según el tipo
        if (passenger.document.type === "DNI") {
            if (!validateDNI(passenger.document.number)) {
                sileo.error({
                    title: "Formato de DNI incorrecto",
                });
                return false;
            }
        } else if (passenger.document.type === "PASSPORT") {
            if (!validatePassport(passenger.document.number)) {
                sileo.error({
                    title: "Formato de pasaporte incorrecto",
                });
                return false;
            }
        }

        if (!passenger.document.country) {
            sileo.error({
                title: "Faltan datos del documento",
            });
            return false;
        }

        if (!passenger.document.expirationDate) {
            sileo.error({
                title: "Faltan datos del documento",
            });
            return false;
        }
    }

    return true;
};
