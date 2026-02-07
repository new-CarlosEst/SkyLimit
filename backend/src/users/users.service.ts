import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Servicio que se encargar de la persistencia de los datos en la tabla User de la db
 */
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    /**
     * Funcion que busca un usuario segun un email
     * @param {string} email Recibe un email a buscar
     * @return {Promise <User | null>} Devuelve un objeto con los datos del usuario o null si no existe
     */
    async getUserByEmail(email :string){
        return this.prisma.user.findUnique({
            where: {email},
        });
    }

}
