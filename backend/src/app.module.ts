import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApiflightModule } from './apiflight/apiflight.module';
import { AirportModule } from './airport/airport.module';
import { MailModule } from './mail/mail.module';
import { PaymentModule } from './payment/payment.module';
import { FlightModule } from './flight/flight.module';
import { ReservationModule } from './reservation/reservation.module';
@Module({
  //Aqui en el modulo de app solo importo los modulos necesarios, nada de controllers ni services (solo los propios de app)
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ApiflightModule,
    AirportModule,
    MailModule,
    PaymentModule,
    FlightModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
