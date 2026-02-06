import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

//TODO: Hacer la logica para hacer los endpoints y consultas a la db
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
