import { Body, Controller, Post, HttpCode, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';

//Aqui me encargare de recibir las rutas de login o registro
@Controller('auth') //Ruta "auth"
export class AuthController {
  //Me creo un service de auth
  constructor(private readonly authService: AuthService) { } //le pongo readonly para que sea inmutable y no pueda ser nulo el AuthService

  //Me creo una ruta de post para el registro (Codigo 201 en caso de exito)
  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  //Me croe la ruta de post para el login (Codigo 200 en caso de exito)
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  //Ruta para validar el token
  @Get('validateJWT')
  @HttpCode(200)
  async validateJWT(@Headers('Authorization') authHeader: string) {
    //Separo el beaer y el valor del token
    const token = authHeader.split(' ')[1];
    //Valido el token
    return this.authService.validateJWT(token);
  }

  //Ruta para enviar un correo de recuperacion de contraseña
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() email: string) {
    //TODO: Descomentar cuando este la funcion
    //return this.authService.forgotPassword(email);
  }
}
