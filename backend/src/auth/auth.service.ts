import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

//Aqui usare bcrypt par encriptar las contraseñas, para generar el token de validacion y comprare la contraseña que me devuelve el recurso de users
@Injectable()
export class AuthService {

    //Me creo un userService para poder llamar a los metodos del crud de modulo users
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Funcion que recibe un email y una contraseña y verifica si coinciden
     * @param email Email del usuario
     * @param password Contraseña del usuario
     * @returns Devuelve un token y la informacion
     */
    public async login (loginDto : LoginDto): Promise<Object>{
        const user = await this.userService.getUserByEmail(loginDto.email)

        //Compruebo la contrseña que viene en "texto plano" con la funcion compare de bycrypt para comprobarla encriptada
        const comprobarContraseñas = await bcrypt.compare(loginDto.password, user.password);

        //Si no coinciden salta que la contraseña es incorrecta
        if (!comprobarContraseñas){
            throw new UnauthorizedException("Contraseña incorrecta");
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
    public async register (registerDto : RegisterDto): Promise<Object>{
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
        const user = await this.userService.createUser(createUserDto)

        //Me hago el payload con el id y el email
        const payload = { sub: user.id, email: user.email };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: new UserEntity(user),
        }
    }
}
