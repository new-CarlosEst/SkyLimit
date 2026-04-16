//Importo los tipos
import type { RegisterData, LoginData } from "../types/auth.types";
//Importo el cliente
import apiClient from "./cliente";

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









