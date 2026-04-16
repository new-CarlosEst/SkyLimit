import { IsEmail } from 'class-validator';

/**
 * Clase para verificar que el formato del email es correcto para forgot-password
 */
export class ForgotPasswordDto {
  @IsEmail({}, { message: 'El formato del email no es válido' })
  email: string;
}
