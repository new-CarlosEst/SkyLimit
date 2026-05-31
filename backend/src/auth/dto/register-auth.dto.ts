import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from '@prisma/client';

/**
 * Clase dto para verificar que el formato de los campos es correcto
 */
export class RegisterDto {
  @IsEmail({}, { message: 'El formato del email no es válido' })
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
