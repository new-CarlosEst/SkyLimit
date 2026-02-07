import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //Uso global para no tener que importarlo en cada modulo que lo use
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
