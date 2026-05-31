import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
constructor(private readonly paymentService: PaymentService) {}

@Post('verify')
@HttpCode(200)
async verifyPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.verifyPayment(createPaymentDto);
}
}
