import { IsEmail, IsOptional, IsNumber, IsString } from "class-validator";

//Dto para actualizar el perfil de usuario, todas las opciones son opcionales
export class UpdateDataDto {
    @IsOptional()
    @IsString()
    name?: string; //Nombre del usuario

    @IsOptional()
    @IsString()
    surname?: string; //Apellido/s del usuario

    @IsOptional()
    @IsNumber()
    favoriteAirportId?: number; //Id del aeropuerto favorito
}