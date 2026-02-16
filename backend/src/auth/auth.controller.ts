import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';

//Aqui me encargare de recibir las rutas de login o registro
@Controller('auth') //Ruta "auth"
export class AuthController {
    //Me creo un service de auth
    constructor(private readonly authService: AuthService){} //le pongo readonly para que sea inmutable y no pueda ser nulo el AuthService

    //TODO: Crear el token con jwt y devolver el token en vez de los datos tanto para /login como para /register

    //Me creo una ruta de post para el registro (Codigo 201 en caso de exito)
    @Post("register")
    @HttpCode(201)
    async register(@Body() registerDto : RegisterDto){
        return this.authService.register(registerDto)
    }

    //Me croe la ruta de post para el login (Codigo 200 en caso de exito)
    @Post("login")
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto)
    }
}
