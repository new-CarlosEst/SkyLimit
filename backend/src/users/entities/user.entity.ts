import { Exclude } from "class-transformer";

/**
 * Clase que sirve como plantilla para cuando se envien los datos al front
 */
export class UserEntity{
    id: number;
    name: string;
    surname: string;
    email: string;
    createdAt: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}