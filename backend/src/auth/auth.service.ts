import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

//Aqui usare bcrypt par encriptar las contraseñas, para generar el token de validacion y comprare la contraseña que me devuelve el recurso de users
@Injectable()
export class AuthService {

    //Me creo un userService para poder llamar a los metodos del crud de modulo users
    constructor(private userService: UsersService) {}

    /**
     * Funcion que recibe un email y una contraseña y verifica si coinciden
     * @param email Email del usuario
     * @param password Contraseña del usuario
     */
    public async login (loginDto : LoginDto): Promise<UserEntity>{
        const user = await this.userService.getUserByEmail(loginDto.email)

        //Compruebo la contrseña que viene en "texto plano" con la funcion compare de bycrypt para comprobarla encriptada
        const comprobarContraseñas = await bcrypt.compare(loginDto.password, user.password);

        //Si no coinciden salta que la contraseña es incorrecta
        if (!comprobarContraseñas){
            throw new UnauthorizedException("Contraseña incorrecta");
        }
        //si no devuelvo el userEntity
        else {
            return new UserEntity(user);
        }
    }

    /**
     * Clase que recibe los datos necesarios validados previamente por un dto para crear un usuario
     * @param registerDto 
     */
    public async register (registerDto : RegisterDto): Promise<UserEntity>{
        //Hasheo la contraseña
        const pwdEncriptada = await bcrypt.hash(registerDto.password, 10);

        //Creo un dto de modulo user para crear el usuario
        const createUserDto: CreateUserDto = {
            ...registerDto, //Cogemos los datos del dto (name, surname, email y password)
            password: pwdEncriptada, //sobrescribimos la contraseña con la contraseña encriptada
        };

        return await this.userService.createUser(createUserDto)
    }
}
