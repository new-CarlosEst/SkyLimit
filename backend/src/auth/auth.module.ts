import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        UsersModule, //Importo el modulo de users para poder usarlo
        PassportModule, //Importo los modulos necesarios para crear el token
        JwtModule.register({
            //clave secreta que hay en el .env (No compartir ya que es para las token para proteger datos)
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' }, //Le digo que expire en 1 dia
        })
    ], 
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule{}