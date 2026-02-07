import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/extension';

/**
 * Servicio encargado de gestionar la conexión con la base de datos mediante el cliente de Prisma.
 * Este tendrá una instancia unica
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    //Me hago la conexion a la db

    /**
     * Funcion que inicia la conexion a la db de postgreSQL con usando el cliente de prisma
     */
    async onModuleInit() {
        await this.$connect();
    }
}
