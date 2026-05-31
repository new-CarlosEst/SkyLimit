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
        const { amount, paymentMethodId, reservationId, email } = createPaymentDto;

        try {
            const reservation = await this.prisma.reservation.findUnique({
                where: {
                    id: parseInt(reservationId),
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
                    'No se encontró la reserva',
                    HttpStatus.NOT_FOUND,
                );
            }
            // Crear PaymentIntent en Stripe
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convertir a centimos
                currency: 'eur',
                payment_method: paymentMethodId,
                confirm: true,
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: 'never',
                },
                metadata: {
                    reservationId,
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
                customerEmail: email,
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
                    cardholderName: email,
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

    async addPaymentMethod(userId: number, addPaymentMethodDto: any) {
        try {
            const { holderName, brand, expirationDate, last4Digits, stripePaymentMethodId } = addPaymentMethodDto;

            // Crear o obtener el cliente de Stripe
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException(
                    'Usuario no encontrado',
                    HttpStatus.NOT_FOUND,
                );
            }

            let stripeCustomerId;
            const existingPaymentMethod = await this.prisma.paymentMethod.findFirst({
                where: { userId },
            });

            if (existingPaymentMethod?.stripeCustomerId) {
                stripeCustomerId = existingPaymentMethod.stripeCustomerId;
            } else {
                // Crear nuevo cliente en Stripe
                const customer = await this.stripe.customers.create({
                    email: user.email,
                    name: `${user.name} ${user.surname}`,
                });
                stripeCustomerId = customer.id;
            }

            // Guardar el método de pago en la base de datos
            const paymentMethod = await this.prisma.paymentMethod.create({
                data: {
                    holderName,
                    brand,
                    expirationDate: new Date(expirationDate),
                    last4Digits,
                    stripeCustomerId,
                    stripePaymentMethodId,
                    userId,
                },
            });

            return {
                success: true,
                paymentMethodId: paymentMethod.id,
                message: 'Método de pago agregado exitosamente',
            };

        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                'Error al agregar el método de pago',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getUserPaymentMethods(userId: number) {
        try {
            const paymentMethods = await this.prisma.paymentMethod.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });

            return {
                success: true,
                paymentMethods,
            };
        } catch (error: any) {
            throw new HttpException(
                'Error al obtener los métodos de pago',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deletePaymentMethod(paymentMethodId: number, userId: number) {
        try {
            // Verify the payment method belongs to the user
            const paymentMethod = await this.prisma.paymentMethod.findFirst({
                where: {
                    id: paymentMethodId,
                    userId,
                },
            });

            if (!paymentMethod) {
                throw new HttpException(
                    'Método de pago no encontrado',
                    HttpStatus.NOT_FOUND,
                );
            }

            // Delete the payment method
            await this.prisma.paymentMethod.delete({
                where: { id: paymentMethodId },
            });

            return {
                success: true,
                message: 'Método de pago eliminado exitosamente',
            };
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                'Error al eliminar el método de pago',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
