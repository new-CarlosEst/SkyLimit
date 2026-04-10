import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApiflightModule } from './apiflight/apiflight.module';
import { AirportModule } from './airport/airport.module';
@Module({
  //Aqui en el modulo de app solo importo los modulos necesarios, nada de controllers ni services (solo los propios de app)
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    PrismaModule, UsersModule, AuthModule, ApiflightModule, AirportModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
