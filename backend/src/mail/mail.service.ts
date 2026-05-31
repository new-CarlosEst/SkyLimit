import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ContactDataDto } from './dto/contact-data.dto';
interface PurchaseMailPayload {
    customerEmail: string;
    customerName: string;
    reservation: any;
    transaction: {
        id: number;
        amount: number;
        currency: string;
        status: string;
        stripePaymentIntentId: string;
        cardBrand: string;
        cardLast4: string;
        cardholderName: string;
    };
}

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    private emailRecoveryBody(token: string, name: string, email: string): string {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="display: flex; width: 100%; justify-content: center; align-items: center;">
                <img src="${this.configService.get<string>('FRONTEND_URL')}/logo.png" 
                    alt="Skylimit Logo" 
                    style="width: 150px; height: 150px;">
            </div>

            <div>
                <p>Hola ${name},</p>

                <p><strong>¿Has olvidado la contraseña?</strong></p>
                <p>Hemos recibido una petición para recuperar tu contraseña.</p>
                <p>Haz clic en el botón de abajo:</p>

                <div style="text-align: center; margin: 20px 0;">
                    <a href="${this.configService.get<string>('FRONTEND_URL')}/?token=${token}"
                        style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                        Recuperar contraseña
                    </a>
                </div>

                <p>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
                <p style="word-break: break-all;">
                    ${this.configService.get<string>('FRONTEND_URL')}/?token=${token}
                </p>
            </div>
        </div>
    `;
}

    public async sendRecoveryEmail(email: string, token: string, name: string) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Recuperación de contraseña - Skylimit',
                html: this.emailRecoveryBody(token, name, email),
            })
        } catch (error) {
            console.log("error enviando el email de recuperacion: ", error)
            throw new InternalServerErrorException('Error al enviar el email de recuperación');
        }
    }

    public async sendContactMail(contactData: ContactDataDto) {
        try {
            await this.mailerService.sendMail({
                to: this.configService.get<string>('EMAIL_ACCOUNT'),
                subject: 'Nuevo mensaje de contacto - Skylimit',
                html: this.emailContactBody(contactData),
            })
        } catch (error) {
            console.log("error enviando el email de contacto: ", error)
            throw new InternalServerErrorException('Error al enviar el email de contacto');
        }
    }

    private emailContactBody(contactData: ContactDataDto): string {
        return `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Nuevo mensaje de contacto</h1>
                </div>

                <!-- Content -->
                <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px;">
                    
                    <div style="margin-bottom: 30px;">
                        <p style="color: #666; font-size: 14px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">Detalles del contacto</p>
                    </div>

                    <!-- Nombre y Apellido -->
                    <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <div style="flex: 1;">
                            <p style="color: #999; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; font-weight: 600;">Nombre</p>
                            <p style="color: #333; font-size: 16px; margin: 0; padding: 10px; background-color: #f5f5f5; border-radius: 4px; border-left: 3px solid #667eea;">${contactData.name}</p>
                        </div>
                        <div style="flex: 1;">
                            <p style="color: #999; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; font-weight: 600;">Apellido</p>
                            <p style="color: #333; font-size: 16px; margin: 0; padding: 10px; background-color: #f5f5f5; border-radius: 4px; border-left: 3px solid #667eea;">${contactData.surname}</p>
                        </div>
                    </div>

                    <!-- Email -->
                    <div style="margin-bottom: 20px;">
                        <p style="color: #999; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; font-weight: 600;">Email</p>
                        <p style="color: #333; font-size: 16px; margin: 0; padding: 10px; background-color: #f5f5f5; border-radius: 4px; border-left: 3px solid #667eea;">
                            <a href="mailto:${contactData.email}" style="color: #667eea; text-decoration: none;">${contactData.email}</a>
                        </p>
                    </div>

                    <!-- Tema -->
                    <div style="margin-bottom: 20px;">
                        <p style="color: #999; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; font-weight: 600;">Tema</p>
                        <p style="color: #333; font-size: 16px; margin: 0; padding: 10px; background-color: #f5f5f5; border-radius: 4px; border-left: 3px solid #667eea;">${contactData.theme}</p>
                    </div>

                    <!-- Mensaje -->
                    <div style="margin-bottom: 30px;">
                        <p style="color: #999; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; font-weight: 600;">Mensaje</p>
                        <div style="color: #333; font-size: 16px; margin: 0; padding: 15px; background-color: #f9f9f9; border-radius: 4px; border-left: 3px solid #764ba2; line-height: 1.6;">
                            ${contactData.message.replace(/\n/g, '<br/>')}
                        </div>
                    </div>

                    <!-- HR -->
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />

                    <!-- Footer Info -->
                    <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                        Este es un mensaje automático. Responde directamente al email: <strong>${contactData.email}</strong>
                    </p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0;">© 2026 Skylimit. Todos los derechos reservados.</p>
                </div>
            </div>
        `;
    }

    public async sendPurchaseDocumentsEmail(payload: PurchaseMailPayload) {
        try {
            const transactionPdf = this.generateSimplePdf([
                'SKYLIMIT - COMPROBANTE DE TRANSACCION',
                `Reserva ID: ${payload.reservation.id}`,
                `Transaccion ID: ${payload.transaction.id}`,
                `Stripe Payment Intent ID: ${payload.transaction.stripePaymentIntentId}`,
                `Estado: ${payload.transaction.status}`,
                `Importe: ${payload.transaction.amount} ${payload.transaction.currency.toUpperCase()}`,
                `Titular: ${payload.transaction.cardholderName}`,
                `Tarjeta: ${payload.transaction.cardBrand.toUpperCase()} ****${payload.transaction.cardLast4}`,
                `Fecha: ${new Date().toISOString()}`,
                '',
                'AVISO IMPORTANTE:',
                'Este comprobante es para fines de testing/desarrollo.',
                'No tiene validez legal ni comercial y no sirve para viajar.',
            ]);

            const ticketPdf = this.generateSimplePdf([
                'SKYLIMIT - DOCUMENTO DE RESERVA / BILLETE DE PRUEBA',
                `Reserva ID: ${payload.reservation.id}`,
                `Clase de viaje: ${payload.reservation.travelClass}`,
                `Estado reserva: ${payload.reservation.status}`,
                `Precio total: ${payload.reservation.price} EUR`,
                '',
                'Tramos:',
                ...payload.reservation.reservationFlights.map((reservationFlight: any, index: number) =>
                    `${index + 1}. ${reservationFlight.flight.airportDeparture.iata} -> ${reservationFlight.flight.airportArrival.iata} | ${reservationFlight.flight.departureDateTime.toISOString()} | ${reservationFlight.flight.airline}`,
                ),
                '',
                `Pasajeros: ${payload.reservation.passengers.length}`,
                ...payload.reservation.passengers.map((passenger: any, index: number) =>
                    `${index + 1}. ${passenger.name} ${passenger.surname}`,
                ),
                '',
                'AVISO IMPORTANTE:',
                'Este billete/reserva es falso y solo valido para pruebas internas.',
                'No permite embarque ni uso comercial.',
            ]);

            await this.mailerService.sendMail({
                to: payload.customerEmail,
                subject: `Confirmacion de reserva #${payload.reservation.id} - Skylimit`,
                html: this.purchaseEmailBody(payload),
                attachments: [
                    {
                        filename: `transaccion-${payload.transaction.id}.pdf`,
                        content: transactionPdf,
                        contentType: 'application/pdf',
                    },
                    {
                        filename: `billete-reserva-${payload.reservation.id}.pdf`,
                        content: ticketPdf,
                        contentType: 'application/pdf',
                    },
                ],
            });
        } catch (error) {
            console.log('error enviando email de compra: ', error);
            throw new InternalServerErrorException(
                'Error al enviar la documentación de la compra por email',
            );
        }
    }

    private purchaseEmailBody(payload: PurchaseMailPayload): string {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #1f2937;">
                <h2 style="margin-bottom: 8px;">Confirmación de compra - Skylimit</h2>
                <p>Hola ${payload.customerName},</p>
                <p>Tu compra se ha procesado correctamente y te adjuntamos:</p>
                <ul>
                    <li>PDF con los datos de la transacción.</li>
                    <li>PDF con los datos del vuelo y de la reserva (billete de prueba).</li>
                </ul>
                <p><strong>Reserva:</strong> #${payload.reservation.id}</p>
                <p><strong>Transacción:</strong> #${payload.transaction.id}</p>
                <p><strong>Importe:</strong> ${payload.transaction.amount} ${payload.transaction.currency.toUpperCase()}</p>
                <div style="margin-top: 24px; border: 1px solid #f59e0b; background: #fffbeb; padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-weight: 700; color: #92400e;">Aviso legal importante</p>
                    <p style="margin: 8px 0 0 0; color: #78350f;">
                        Este correo y los documentos adjuntos son material de pruebas internas. Las transacciones, billetes y reservas aquí reflejados no son válidos para viaje, uso comercial ni efectos legales.
                    </p>
                </div>
                <p style="margin-top: 24px;">Gracias por usar Skylimit.</p>
            </div>
        `;
    }

    private generateSimplePdf(lines: string[]): Buffer {
        const safeLines = lines.map((line) =>
            line.replace(/[^\x20-\x7E]/g, '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'),
        );

        let yPosition = 790;
        const commands = safeLines
            .map((line) => {
                const cmd = `BT /F1 11 Tf 40 ${yPosition} Td (${line}) Tj ET`;
                yPosition -= 18;
                return cmd;
            })
            .join('\n');

        const contentStream = `${commands}\n`;
        const streamLength = Buffer.byteLength(contentStream, 'latin1');
        const header = '%PDF-1.4\n';
        const obj1 = '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n';
        const obj2 = '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n';
        const obj3 =
            '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n';
        const obj4 = '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n';
        const obj5 = `5 0 obj << /Length ${streamLength} >> stream\n${contentStream}endstream endobj\n`;

        const offsets: number[] = [];
        let cursor = header.length;
        const objects = [obj1, obj2, obj3, obj4, obj5];
        for (const objectDef of objects) {
            offsets.push(cursor);
            cursor += objectDef.length;
        }

        const xrefStart = cursor;
        const xref =
            `xref\n0 6\n0000000000 65535 f \n` +
            offsets
                .map((offset) => `${offset.toString().padStart(10, '0')} 00000 n \n`)
                .join('') +
            `trailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

        return Buffer.from(header + objects.join('') + xref, 'latin1');
    }
}
