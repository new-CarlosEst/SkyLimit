import { ContactDataDto } from '../dto/contact-data.dto';

export function contactTemplate(contactData: ContactDataDto): string {
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
