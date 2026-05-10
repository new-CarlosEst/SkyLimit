//Importo los tipos
import type { RegisterData, LoginData } from "../types/auth.types";
//Importo el cliente
import apiClient from "./cliente";
import { useAuthStore } from "../store/authStore";

//Peticion con axios para el register
export const register = async (data: RegisterData) => {
    return apiClient.post("/auth/register", data);
}

//Peticion con axios para el login
export const login = async (data: LoginData) => {
    return apiClient.post("/auth/login", data)
}

//Peticion con axios para verifcar el token
export const validateJWT = async (token: string) => {
    return apiClient.get("/auth/validateJWT",
        {
            //Envio el token en el header
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

//Peticion con axios para el forgot password
export const forgotPassword = async (email : string) => {
    return apiClient.post("/auth/forgot-password", { email })
}

//Peticion con axios para el reset password
export const resetPassword = async (token: string, password: string) => {
    return apiClient.post("/auth/reset-password", { token, password })
}

//Peticion con axios para el contact
export const contact = async (data: any) => {
    return apiClient.post("/auth/contact", data)
}

//Peticion con axios para actualizar datos personales
export const updatePersonalData = async (data: { name?: string; surname?: string; favoriteAirportId?: number }) => {
    // Obtener el token de la store de Zustand
    const authStore = useAuthStore.getState();
    const token = authStore.token;
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }
    
    // El backend espera token y updateDataDto en el body
    return apiClient.post("/auth/update-data", {
        token: token,
        updateDataDto: data
    });
}

//Peticion con axios para registrar un administrador
export const registerAdmin = async (email: string) => {
    // Obtener el token de la store de Zustand
    const authStore = useAuthStore.getState();
    const token = authStore.token;
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }
    
    return apiClient.post("/auth/register-admin", { email }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}









