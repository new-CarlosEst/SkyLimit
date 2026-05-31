import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
const Stripe = require('stripe');
import { CreatePaymentDto } from './dto/payment.dto';
import { TransactionStatus } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PaymentService {
    private stripe: any;

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
    ) {
        this.stripe = new Stripe(this.configService.get<string>('SECRET_STRIPE_KEY')!, {
            apiVersion: '2026-04-22.dahlia',
        });
    }

    async verifyPayment(createPaymentDto: CreatePaymentDto) {
        const { amount, paymentMethodId, reservationId, userId, cardholderName } = createPaymentDto;

        try {
            const reservation = await this.prisma.reservation.findFirst({
                where: {
                    id: parseInt(reservationId),
                    userId: parseInt(userId),
                },
                include: {
                    user: true,
                    reservationFlights: {
                        include: {
                            flight: {
                                include: {
                                    airportDeparture: true,
                                    airportArrival: true,
                                },
                            },
                        },
                    },
                    passengers: {
                        include: {
                            documents: true,
                        },
                    },
                    seats: true,
                },
            });

            if (!reservation) {
                throw new HttpException(
                    'No se encontró la reserva para el usuario indicado',
                    HttpStatus.NOT_FOUND,
                );
            }
            // Crear PaymentIntent en Stripe
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convertir a centimos
                currency: 'eur',
                payment_method: paymentMethodId,
                confirm: true,
                metadata: {
                    reservationId,
                    userId,
                },
            });

            // Si el pago no es exitoso devuelvo error con http code
            if (paymentIntent.status !== 'succeeded') {
                throw new HttpException(
                    `Pago rechazado. Estado: ${paymentIntent.status}`,
                    HttpStatus.PAYMENT_REQUIRED,
                );
            }


            // Obtengo los pagos
            const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);

            // Guardar en la tabla Transaction
            const transaction = await this.prisma.transaction.create({
                data: {
                    amount,
                    currency: 'eur',
                    status: 'COMPLETED' as TransactionStatus,
                    stripePaymentIntentId: paymentIntent.id,
                    cardBrand: paymentMethod.card?.brand || 'unknown',
                    cardLast4: paymentMethod.card?.last4 || '',
                    reservationId: reservation.id,
                },
            });

            await this.prisma.reservation.update({
                where: { id: reservation.id },
                data: { status: 'CONFIRMED' },
            });
            reservation.status = 'CONFIRMED';

            await this.mailService.sendPurchaseDocumentsEmail({
                customerEmail: reservation.user.email,
                customerName: `${reservation.user.name} ${reservation.user.surname}`,
                reservation,
                transaction: {
                    id: transaction.id,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    status: transaction.status,
                    stripePaymentIntentId: paymentIntent.id,
                    cardBrand: paymentMethod.card?.brand || 'unknown',
                    cardLast4: paymentMethod.card?.last4 || '',
                    cardholderName,
                },
            });

            return {
                success: true,
                transactionId: transaction.id,
                stripePaymentIntentId: paymentIntent.id,
                amount,
                status: transaction.status,
                cardBrand: transaction.cardBrand,
                cardLast4: transaction.cardLast4,
                message: 'Pago verificado exitosamente y documentación enviada por correo',
            };

        } catch (error: any) {
            // Si es una excepción que ya lanzamos
            if (error instanceof HttpException) {
                throw error;
            }

            // Errores de Stripe
            if (error.code === 'card_declined') {
                throw new HttpException(
                    'Tarjeta rechazada',
                    HttpStatus.PAYMENT_REQUIRED,
                );
            }

            if (error.code === 'card_error') {
                throw new HttpException(
                    error.message,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (error.code === 'authentication_error') {
                throw new HttpException(
                    'Error de autenticación con Stripe',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            throw new HttpException(
                'Error al procesar el pago',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getTransactionById(transactionId: number) {
        try {
            const transaction = await this.prisma.transaction.findUnique({
                where: { id: transactionId },
                include: {
                    reservation: true,
                    paymentMethod: true,
                },
            });

            if (!transaction) {
                throw new HttpException(
                    'Transacción no encontrada',
                    HttpStatus.NOT_FOUND,
                );
            }

            return {
                success: true,
                transaction,
            };

        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                'Error al obtener la transacción',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getUserTransactions(userId: number) {
        try {
            const transactions = await this.prisma.transaction.findMany({
                where: {
                    reservation: {
                        userId,
                    },
                },
                include: {
                    reservation: {
                        include: {
                            reservationFlights: {
                                include: {
                                    flight: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return {
                success: true,
                total: transactions.length,
                transactions,
            };

        } catch (error: any) {
            throw new HttpException(
                'Error al obtener las transacciones del usuario',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async refundTransaction(transactionId: number) {
        try {
            // Obtener la transacción
            const transaction = await this.prisma.transaction.findUnique({
                where: { id: transactionId },
            });

            if (!transaction) {
                throw new HttpException(
                    'Transacción no encontrada',
                    HttpStatus.NOT_FOUND,
                );
            }

            if (!transaction.stripePaymentIntentId) {
                throw new HttpException(
                    'No hay PaymentIntent de Stripe asociado',
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Crear reembolso en Stripe
            const refund = await this.stripe.refunds.create({
                payment_intent: transaction.stripePaymentIntentId,
            });

            // Actualizar estado en BD
            await this.prisma.transaction.update({
                where: { id: transactionId },
                data: { status: 'REFUNDED' as TransactionStatus },
            });

            return {
                success: true,
                refundId: refund.id,
                message: 'Reembolso procesado exitosamente',
            };

        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                'Error al procesar el reembolso',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
