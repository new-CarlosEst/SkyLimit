import { Controller, Post, Get, Body, Param, Query, HttpCode } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, GetUserPaymentsDto, GetPaymentByIdDto, RefundPaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
constructor(private readonly paymentService: PaymentService) {}

//Verificaun pago con stripe y guarda la transaccion en la bd
@Post('verify')
@HttpCode(200)
async verifyPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.verifyPayment(createPaymentDto);
}

//Saco los datos del a transaccion
@Get('transaction')
async getTransactionById(@Query('id') transactionId: string) {
    return this.paymentService.getTransactionById(parseInt(transactionId));
}

//Obtengo todas las transacciones del usuario
@Get('user-transactions')
async getUserTransactions(@Query() getUserPaymentsDto: GetUserPaymentsDto) {
    return this.paymentService.getUserTransactions(parseInt(getUserPaymentsDto.userId));
}

//Procesa un reembolso
@Post('refund')
@HttpCode(200)
async refundTransaction(@Body() refundPaymentDto: RefundPaymentDto) {
    return this.paymentService.refundTransaction(parseInt(refundPaymentDto.paymentId));
}
}
