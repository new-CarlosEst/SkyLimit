export interface PurchaseMailPayload {
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

export function purchaseEmailTemplate(payload: PurchaseMailPayload): string {
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
