//Tipos de datos para las peticiones

//======================================
//  Datos para auth (Registro y login)
//======================================
export interface RegisterData{
    email: string;
    password: string;
    name: string;
    surname: string;
}

export interface LoginData{
    email: string;
    password: string;
}