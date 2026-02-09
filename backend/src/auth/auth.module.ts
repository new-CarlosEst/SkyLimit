import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule], //Importo el modulo de users para asi poder usar su servicio en los metodos de login
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule{}