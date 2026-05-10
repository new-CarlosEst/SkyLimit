import { Body, Controller, Post, HttpCode, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateDataRequestDto } from './dto/update-data-request.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { SuperAdminGuard } from './guards/super-admin.guard';

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
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  //Ruta para resetear la contraseña con el token
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  //Ruta para actualizar el perfil de usuario, pasando  o nombre, o apellido/s o actualizar el aeropuerto favorito
  @Post('update-data')
  @HttpCode(200)
  async updateData(@Body() updateDataRequest: UpdateDataRequestDto) {
    return this.authService.updateData(updateDataRequest.token, updateDataRequest.updateDataDto || {});
  }

  //Ruta para dar de alta a un nuevo administrador
  @Post('register-admin')
  @UseGuards(SuperAdminGuard)
  @HttpCode(201)
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto) {
    return this.authService.registerAdmin(registerAdminDto.email);
  }

  //Ruta para el contacto
  @Post('contact')
  @HttpCode(200)
  async contact(@Body() contactDto: any) {
    //return this.authService.contact(contactDto);
    return  {
      message: "Mensaje enviado correctamente"
    }
  }
}
