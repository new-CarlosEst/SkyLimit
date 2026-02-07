import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

/**
 * Clase que hereda las restricciones de validacion de los datos pero para cuando hay que actualizar un registro
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}