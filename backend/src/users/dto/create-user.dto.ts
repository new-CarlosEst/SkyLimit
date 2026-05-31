import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from '@prisma/client';

/**
 * Clase que añade restricciones a como vienen datos, si no vienen en el formato correctos devuelve un error.
 * Esta clase DTO es especifica a cuando se va a crear un usuario
 */
export class CreateUserDto {
  @IsEmail({}, { message: 'El formato del email no es valido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsOptional()
  @IsEnum(Role, {
    message: 'El rol debe ser USER, ADMIN o SUPERADMIN',
  })
  role?: Role = Role.USER;
}
