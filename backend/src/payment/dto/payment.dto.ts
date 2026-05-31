import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsPositive, IsEmail } from 'class-validator';

export class CreatePaymentDto {
    @Transform(({ value }) => Math.round(Number(value) * 100) / 100)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    amount: number;

    @IsString()
    paymentMethodId: string;

    @IsString()
    reservationId: string;

    @IsEmail()
    email: string;
}