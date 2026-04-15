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









