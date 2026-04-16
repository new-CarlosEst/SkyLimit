import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

//Aqui usare bcrypt par encriptar las contraseñas, para generar el token de validacion y comprare la contraseña que me devuelve el recurso de users
@Injectable()
export class AuthService {
  //Me creo un userService para poder llamar a los metodos del crud de modulo users
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  /**
   * Funcion que recibe un email y una contraseña y verifica si coinciden
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Devuelve un token y la informacion
   */
  public async login(loginDto: LoginDto): Promise<object> {
    let user;
    try {
      user = await this.userService.getUserByEmail(loginDto.email);
    } catch (error) {
      throw new UnauthorizedException('Usuario y/o contraseña incorrectos');
    }

    //Compruebo la contrseña que viene en "texto plano" con la funcion compare de bycrypt para comprobarla encriptada
    const comprobarContraseñas = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    //Si no coinciden salta que la contraseña es incorrecta
    if (!comprobarContraseñas) {
      throw new UnauthorizedException('Usuario y/o contraseña incorrectos');
    }
    //si no devuelvo el los datos y el token
    else {
      //Creo el payload (Datos del token), metiendo solo el id y el email (Al ser unicos puedo hacer busqueda a partir de ellos)
      const payload = { sub: user.id, email: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
        user: new UserEntity(user),
      };
    }
  }

  /**
   * Clase que recibe los datos necesarios validados previamente por un dto para crear un usuario
   * @param registerDto Datos de recibidos como dto
   * @
   */
  public async register(registerDto: RegisterDto): Promise<object> {
    //Hasheo la contraseña
    const pwdEncriptada = await bcrypt.hash(registerDto.password, 10);

    //Creo un dto de modulo user para crear el usuario
    const createUserDto: CreateUserDto = {
      name: registerDto.name,
      surname: registerDto.surname,
      email: registerDto.email,
      password: pwdEncriptada, //sobrescribimos la contraseña con la contraseña encriptada
      role: registerDto.role || 'USER', //asignamos el rol o el valor por defecto
    };

    //Me guardo el usuario
    const user = await this.userService.createUser(createUserDto);

    //Me hago el payload con el id y el email
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: new UserEntity(user),
    };
  }

  /**
   * Metodo que valida el token
   * @param token Token a validar
   * @returns Devuelve el token y los datos de usuario
   */
  public async validateJWT(token: string): Promise<object> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return {
        //Devuelvo el token y los datos de usuario
        access_token: token,
        user: await this.userService.getUserByEmail(payload.email),
      };
    } catch (error) {
      throw new UnauthorizedException('Token invalido');
    }
  }


  /**
   * Metodo que envia un correo de recuperacion de contraseña
   * @param email Email del usuario
   * @returns Devuelve un mensaje de confirmacion
   */
  public async forgotPassword(email: string): Promise<object> {
    //Me busco el usuario
    const user = await this.userService.getUserByEmail(email);

    //si no existe lanzo el error
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    //Genero el token que expirar en 15 min
    const token = await this.jwtService.signAsync(
      { email: user.email },
      { expiresIn: '15m' },
    );

    //Envio el email con el token
    await this.mailService.sendRecoveryEmail(user.email, token, user.name);

    return {
      message: 'Email de recuperación enviado',
    };
  }

  /**
   * Metodo que resetea la contraseña usando el token
   * @param resetPasswordDto Token y nueva contraseña
   * @returns Devuelve un mensaje de confirmacion
   */
  public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<object> {
    try {
      // Verifico el token y obtengo el email del payload
      const payload = await this.jwtService.verifyAsync(resetPasswordDto.token);
      const email = payload.email;

      // Hasheo la nueva contraseña
      const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

      // Actualizo la contraseña
      await this.userService.updatePassword(email, hashedPassword);

      return {
        message: 'Contraseña actualizada correctamente',
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
