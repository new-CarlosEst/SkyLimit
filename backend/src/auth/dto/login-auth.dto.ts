import { IsEmail, IsString } from "class-validator";

/**
 * Clase para verificar que el formato de los datos de login es correcto
 */
export class LoginDto {
    @IsEmail({}, { message: "El formtado del email no es valido"})
    email:string;

    @IsString()
    password: string;
}