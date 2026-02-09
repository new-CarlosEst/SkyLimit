import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';

//Aqui me encargare de recibir las rutas de login o registro
@Controller('auth') //Ruta "auth"
export class AuthController {
    //Me creo un service de auth
    constructor(private readonly authService: AuthService){} //le pongo readonly para que sea inmutable y no pueda ser nulo el AuthService

    //Me creo una ruta de post para el registro
    @Post("register")
    async register(@Body() registerDto : RegisterDto){
        return this.authService.register(registerDto)
    }

    //Me croe la ruta de post para el login
    @Post("login")
    async login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto)
    }
}
