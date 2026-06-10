import { PurchaseMailPayload } from './purchase-email.template';

export interface BillTemplateData extends PurchaseMailPayload {
    frontendUrl: string;
    fromEmail: string;
}

export function billTemplate(data: BillTemplateData): string {
    const formatDate = (date: Date) => date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formatCurrency = (amount: number) => `${amount.toFixed(2)} EUR`;

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    color: #000;
                    line-height: 1.4;
                    background: #fff;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 40px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 20px;
                }
                .logo {
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }
                .invoice-info {
                    text-align: right;
                }
                .invoice-info h1 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                .invoice-info p {
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                .invoice-info strong {
                    font-weight: 700;
                }
                .section {
                    margin-bottom: 30px;
                }
                .section-title {
                    font-size: 14px;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 15px;
                    letter-spacing: 1px;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 30px;
                }
                .info-box p {
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                .info-box strong {
                    font-weight: 700;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                th {
                    background: #000;
                    color: #fff;
                    padding: 12px;
                    text-align: left;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 700;
                }
                td {
                    padding: 12px;
                    border-bottom: 1px solid #e0e0e0;
                    font-size: 14px;
                }
                .total-section {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 30px;
                }
                .total-box {
                    width: 300px;
                }
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #e0e0e0;
                }
                .total-row.final {
                    border-top: 2px solid #000;
                    border-bottom: none;
                    font-weight: 700;
                    font-size: 18px;
                    padding-top: 15px;
                }
                .disclaimer {
                    background: #f5f5f5;
                    padding: 20px;
                    border-left: 4px solid #000;
                    margin-bottom: 30px;
                }
                .disclaimer p {
                    font-size: 12px;
                    margin-bottom: 5px;
                }
                .disclaimer strong {
                    font-weight: 700;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #e0e0e0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">
                        <img src="${data.frontendUrl}/black-logo.png" 
                             alt="Skylimit Logo" 
                             style="width: 80px; height: 80px;">
                        SKYLIMIT
                    </div>
                    <div class="invoice-info">
                        <h1>FACTURA</h1>
                        <p><strong>Nº Factura:</strong> INV-${data.transaction.id}</p>
                        <p><strong>Fecha:</strong> ${formatDate(new Date())}</p>
                        <p><strong>Reserva ID:</strong> #${data.reservation.id}</p>
                    </div>
                </div>

                <div class="info-grid">
                    <div class="info-box">
                        <div class="section-title">EMISOR</div>
                        <p><strong>Skylimit</strong></p>
                        <p>Skylimit Offices</p>
                        <p>Madrid, Spain</p>
                        <p>Email: ${data.fromEmail}</p>
                    </div>
                    <div class="info-box">
                        <div class="section-title">CLIENTE</div>
                        <p><strong>${data.customerName}</strong></p>
                        <p>${data.customerEmail}</p>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">DETALLES DE PAGO</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Concepto</th>
                                <th>Detalles</th>
                                <th style="text-align: right;">Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Reserva de Vuelo #${data.reservation.id}</td>
                                <td>
                                    Clase: ${data.reservation.travelClass}<br>
                                    Estado: ${data.reservation.status}<br>
                                    Pasajeros: ${data.reservation.passengers.length}
                                </td>
                                <td style="text-align: right;">${formatCurrency(data.reservation.price)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="total-section">
                    <div class="total-box">
                        <div class="total-row">
                            <span>Subtotal</span>
                            <span>${formatCurrency(data.reservation.price)}</span>
                        </div>
                        <div class="total-row">
                            <span>IVA (0%)</span>
                            <span>0.00 EUR</span>
                        </div>
                        <div class="total-row final">
                            <span>TOTAL</span>
                            <span>${formatCurrency(data.transaction.amount)}</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">INFORMACIÓN DE TRANSACCIÓN</div>
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>ID Transacción:</strong></td>
                                <td>${data.transaction.id}</td>
                            </tr>
                            <tr>
                                <td><strong>Stripe Payment Intent ID:</strong></td>
                                <td>${data.transaction.stripePaymentIntentId}</td>
                            </tr>
                            <tr>
                                <td><strong>Estado:</strong></td>
                                <td>${data.transaction.status}</td>
                            </tr>
                            <tr>
                                <td><strong>Tarjeta:</strong></td>
                                <td>${data.transaction.cardBrand.toUpperCase()} ****${data.transaction.cardLast4}</td>
                            </tr>
                            <tr>
                                <td><strong>Titular:</strong></td>
                                <td>${data.transaction.cardholderName}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="disclaimer">
                    <p><strong>AVISO IMPORTANTE:</strong></p>
                    <p>Este documento es meramente académico y no tiene validez legal ni comercial.</p>
                    <p>No sirve para viajar ni para ningún propósito en la vida real.</p>
                    <p>Es un documento de prueba generado para fines educativos.</p>
                </div>

                <div class="footer">
                    <p>© 2026 Skylimit. Todos los derechos reservados.</p>
                    <p>Este documento no tiene validez legal ni comercial.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
