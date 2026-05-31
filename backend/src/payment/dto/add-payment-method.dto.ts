import { IsString, IsDateString } from 'class-validator';

export class AddPaymentMethodDto {
    @IsString()
    holderName: string;

    @IsString()
    brand: string;

    @IsDateString()
    expirationDate: string;

    @IsString()
    last4Digits: string;

    @IsString()
    stripePaymentMethodId: string;
}
