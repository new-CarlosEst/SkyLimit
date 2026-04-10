import { Module } from '@nestjs/common';
import { ApiflightController } from './apiflight.controller';
import { ApiflightService } from './apiflight.service';
import { AirportModule } from '../airport/airport.module';

@Module({
  imports: [AirportModule],
  controllers: [ApiflightController],
  providers: [ApiflightService]
})
export class ApiflightModule {}
