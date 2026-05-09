import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class RegisterAdminDto {
  @IsEmail({}, { message: 'El formato del email no es valido' })
  @IsString()
  @IsNotEmpty()
  email: string;
}
