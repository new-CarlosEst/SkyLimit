import "dotenv/config"
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from "@prisma/client";

/**
 * Servicio encargado de gestionar la conexión con la base de datos mediante el cliente de Prisma.
 * Este tendrá una instancia unica
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    // private prisma = new PrismaClient();
    
    constructor() {
        super({
        });
    }
    /**
     * Funcion que inicia la conexion a la db de postgreSQL con usando el cliente de prisma
     */
    async onModuleInit() {
        await this.$connect();
    }

    get user(){
        return this.user;
    }
}
