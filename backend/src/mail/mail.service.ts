import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContactDataDto } from './dto/contact-data.dto';
import * as sgMail from '@sendgrid/mail';
import * as puppeteer from 'puppeteer';
import { recoveryTemplate, RecoveryTemplateData } from './templates/recovery.template';
import { contactTemplate } from './templates/contact.template';
import { purchaseEmailTemplate, PurchaseMailPayload } from './templates/purchase-email.template';
import { billTemplate, BillTemplateData } from './templates/bill.template';
import { ticketTemplate, TicketTemplateData } from './templates/ticket.template';

@Injectable()
export class MailService {
    private readonly fromEmail: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY')!);
        this.fromEmail = this.configService.get<string>('EMAIL_ACCOUNT')!;
    }

    public async sendRecoveryEmail(email: string, token: string, name: string) {
        try {
            const data: RecoveryTemplateData = {
                token,
                name,
                email,
                frontendUrl: this.configService.get<string>('FRONTEND_URL')!
            };
            
            await sgMail.send({
                to: email,
                from: this.fromEmail,
                subject: 'Recuperación de contraseña - Skylimit',
                html: recoveryTemplate(data),
            });
        } catch (error) {
            console.error(`[MailService][sendRecoveryEmail] Error al enviar email a: ${email}`);
            console.error(`  SENDGRID_API_KEY definida: ${!!this.configService.get<string>('SENDGRID_API_KEY')}`);
            console.error(`  FROM email: ${this.fromEmail}`);
            console.error(`  Mensaje: ${error?.message}`);
            console.error(`  Status code: ${error?.code}`);
            if (error?.response) {
                console.error(`  Response body: ${JSON.stringify(error.response.body)}`);
            }
            console.error(`  Stack: ${error?.stack}`);
            throw new InternalServerErrorException('Error al enviar el email de recuperación');
        }
    }

    public async sendContactMail(contactData: ContactDataDto) {
        try {
            await sgMail.send({
                to: this.configService.get<string>('EMAIL_ACCOUNT'),
                from: this.fromEmail,
                subject: 'Nuevo mensaje de contacto - Skylimit',
                html: contactTemplate(contactData),
            });
        } catch (error) {
            const emailAccount = this.configService.get<string>('EMAIL_ACCOUNT');
            console.error(`[MailService][sendContactMail] Error al enviar email de contacto`);
            console.error(`  Destino: ${emailAccount ? `${emailAccount.substring(0, 4)}...` : 'NO DEFINIDO'}`);
            console.error(`  SENDGRID_API_KEY definida: ${!!this.configService.get<string>('SENDGRID_API_KEY')}`);
            console.error(`  Mensaje: ${error?.message}`);
            console.error(`  Status code: ${error?.code}`);
            if (error?.response) {
                console.error(`  Response body: ${JSON.stringify(error.response.body)}`);
            }
            console.error(`  Stack: ${error?.stack}`);
            throw new InternalServerErrorException('Error al enviar el email de contacto');
        }
    }

    public async sendPurchaseDocumentsEmail(payload: PurchaseMailPayload) {
        try {
            const billData: BillTemplateData = {
                ...payload,
                frontendUrl: this.configService.get<string>('FRONTEND_URL')!,
                fromEmail: this.fromEmail
            };
            
            const ticketData: TicketTemplateData = {
                ...payload,
                frontendUrl: this.configService.get<string>('FRONTEND_URL')!
            };

            const billHtml = billTemplate(billData);
            const ticketHtml = ticketTemplate(ticketData);

            const billPdf = await this.generatePdfWithPuppeteer(billHtml);
            const ticketPdf = await this.generatePdfWithPuppeteer(ticketHtml);

            await sgMail.send({
                to: payload.customerEmail,
                from: this.fromEmail,
                subject: `Confirmacion de reserva #${payload.reservation.id} - Skylimit`,
                html: purchaseEmailTemplate(payload),
                attachments: [
                    {
                        content: billPdf.toString('base64'),
                        filename: `factura-${payload.transaction.id}.pdf`,
                        type: 'application/pdf',
                        disposition: 'attachment',
                    },
                    {
                        content: ticketPdf.toString('base64'),
                        filename: `billete-reserva-${payload.reservation.id}.pdf`,
                        type: 'application/pdf',
                        disposition: 'attachment',
                    },
                ],
            });
        } catch (error) {
            console.error(`[MailService][sendPurchaseDocumentsEmail] Error al enviar email a: ${payload.customerEmail}`);
            console.error(`  Reserva ID: ${payload.reservation?.id}`);
            console.error(`  Transaccion ID: ${payload.transaction?.id}`);
            console.error(`  SENDGRID_API_KEY definida: ${!!this.configService.get<string>('SENDGRID_API_KEY')}`);
            console.error(`  FROM email: ${this.fromEmail}`);
            console.error(`  Mensaje: ${error?.message}`);
            console.error(`  Status code: ${error?.code}`);
            if (error?.response) {
                console.error(`  Response body: ${JSON.stringify(error.response.body)}`);
            }
            console.error(`  Stack: ${error?.stack}`);
            throw new InternalServerErrorException('Error al enviar la documentación de la compra por email');
        }
    }

    private async generatePdfWithPuppeteer(html: string): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });
        
        await browser.close();
        
        return Buffer.from(pdfBuffer);
    }
}
