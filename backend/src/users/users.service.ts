import { 
    Injectable, 
    ConflictException, 
    InternalServerErrorException, 
    NotFoundException 
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * Servicio que se encargar de la persistencia de los datos en la tabla User de la db
 */
@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }
    /**
     * Funcion que busca un usuario segun un email
     * @param  email 
     * 
     * Recibe un email a buscar
     * @return Devuelve un objeto entero con todos los datos (incluyendo contraseña)
     */
    public async getUserByEmail(email: string): Promise<User> {
        //Busco por email (si usas findUnique el campo tiene que tener @unique en el esquema de prisma)
        const user = await this.prisma.user.findUnique({
            where: {email}
        })

        //Si el email no existe devuelvo null, si no devuelvo el user
        if (!user){
            throw new NotFoundException("Usuario no encontrado")
        }
        else {
            return user;
        }
    }

    /**
     * Funcion que devuelve los datos de un usuario por su email
     * @param email 
     * @returns Devuelve un userEntity (todos los datos menos la contraseña)
     */
    public async findUserByEmail(email : string): Promise <UserEntity>{
        const user = await this.getUserByEmail(email)
        return new UserEntity(user)
    }

    /**
     * Recibe un usuario validado y lo inserta en al base de datos
     * @param createUserDto 
     * @returns Devuelve los datos del usuario o un error
     */
    public async createUser(createUserDto : CreateUserDto ): Promise <UserEntity>{
        try{
            const user = await this.prisma.user.create({
                data: createUserDto
            });

            return new UserEntity(user)
        } catch (error){
            if (error.code === "P2002"){
                throw new ConflictException ("Este usuario ya está registrado")
            }
            throw new InternalServerErrorException("Error al crear al usuario");
        }
    }
    
}
