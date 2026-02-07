import { Injectable } from '@nestjs/common';

//Aqui usare bcrypt par encriptar las contraseñas, para generar el token de validacion y comprare la contraseña que me devuelve el recurso de users
@Injectable()
export class AuthService {

    /**
     * 
     */
    async login (email :string, password :string){
        //TODO: sacar datos de usuarios una vez hecho el modulo de usuarios (users)
    }
}
