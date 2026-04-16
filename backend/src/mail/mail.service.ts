import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

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
                    <a href="${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}&email=${email}"
                        style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                        Recuperar contraseña
                    </a>
                </div>

                <p>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
                <p style="word-break: break-all;">
                    ${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}&email=${email}
                </p>
            </div>
        </div>
    `;
}

    async sendRecoveryEmail(email: string, token: string, name: string) {
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
}
