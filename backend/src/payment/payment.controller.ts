import { Controller, Post, Get, Delete, Body, Query, HttpCode } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { AddPaymentMethodDto } from './dto/add-payment-method.dto';

@Controller('payment')
export class PaymentController {
constructor(private readonly paymentService: PaymentService) {}

@Post('verify')
@HttpCode(200)
async verifyPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.verifyPayment(createPaymentDto);
}

@Post('add-method')
@HttpCode(201)
async addPaymentMethod(
    @Query('userId') userId: number,
    @Body() addPaymentMethodDto: AddPaymentMethodDto,
) {
    return this.paymentService.addPaymentMethod(userId, addPaymentMethodDto);
}

@Get('user-methods')
@HttpCode(200)
async getUserPaymentMethods(@Query('userId') userId: number) {
    return this.paymentService.getUserPaymentMethods(userId);
}

@Delete('delete-method')
@HttpCode(200)
async deletePaymentMethod(
    @Query('paymentMethodId') paymentMethodId: number,
    @Query('userId') userId: number,
) {
    return this.paymentService.deletePaymentMethod(paymentMethodId, userId);
}
}
