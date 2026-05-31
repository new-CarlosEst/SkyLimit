import { IsEmail, IsString } from "class-validator";

export class ContactDataDto {
    @IsString()
    name: string;
    @IsString()
    surname: string;
    @IsEmail()
    email: string;
    @IsString()
    theme: string;
    @IsString()
    message: string;
}