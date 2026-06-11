export interface RecoveryTemplateData {
    token: string;
    name: string;
    email: string;
    frontendUrl: string;
}

export function recoveryTemplate(data: RecoveryTemplateData): string {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="display: flex; width: 100%; justify-content: center; align-items: center;">
                <img src="${data.frontendUrl}/blue-logo-letters.png"
                    alt="Skylimit Logo"
                    style="width: 150px; height: 150px;">
            </div>

            <div>
                <p>Hola ${data.name},</p>

                <p><strong>¿Has olvidado la contraseña?</strong></p>
                <p>Hemos recibido una petición para recuperar tu contraseña.</p>
                <p>Haz clic en el botón de abajo:</p>

                <div style="text-align: center; margin: 20px 0;">
                    <a href="${data.frontendUrl}/?token=${data.token}"
                        style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                        Recuperar contraseña
                    </a>
                </div>

                <p>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
                <p style="word-break: break-all;">
                    ${data.frontendUrl}/?token=${data.token}
                </p>
            </div>
        </div>
    `;
}
