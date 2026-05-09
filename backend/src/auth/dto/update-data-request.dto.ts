import { IsString, IsOptional, IsNumber, IsNotEmpty } from "class-validator";
import { UpdateDataDto } from "./update-data.dto";

// DTO combinado para la petición de actualización de datos
export class UpdateDataRequestDto {
    @IsString()
    @IsNotEmpty()
    token: string; // Token de autenticación

    @IsOptional()
    updateDataDto?: UpdateDataDto; // Datos a actualizar (opcional para validación)
}
