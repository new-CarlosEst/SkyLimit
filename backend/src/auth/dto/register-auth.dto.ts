import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from "class-validator";

/**
 * Clase dto para verificar que el formato de los campos es correcto
 */
export class RegisterDto {
    @IsEmail({}, { message: "El formato del email no es válido" })
    email: string;

    @IsString()
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    password: string;

    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsOptional()
    @IsEnum(['USER', 'ADMIN', 'SUPERADMIN'], { message: "El rol debe ser USER, ADMIN o SUPERADMIN" })
    role?: string = 'USER';
}