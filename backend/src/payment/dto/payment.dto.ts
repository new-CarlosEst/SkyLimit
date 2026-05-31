import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreatePaymentDto {
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    amount: number; // en euros (99.99)

    @IsString()
    paymentMethodId: string; //Id generado en el frontend

    @IsString()
    reservationId: string;

    @IsString()
    userId: string;

    @IsString()
    cardholderName: string;
}


export class GetPaymentByIdDto {
    @IsString()
    paymentId: string;
}


export class RefundPaymentDto {
    @IsString()
    paymentId: string;
}

export class GetUserPaymentsDto {
    @IsString()
    userId: string;
}