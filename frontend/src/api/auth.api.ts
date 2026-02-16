//Importo los tipos
import type { RegisterData, LoginData } from "./types";
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









