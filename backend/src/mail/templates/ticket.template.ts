import { PurchaseMailPayload } from './purchase-email.template';

export interface TicketTemplateData extends PurchaseMailPayload {
    frontendUrl: string;
}

export function ticketTemplate(data: TicketTemplateData): string {
    const formatDate = (date: Date) => date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const formatCurrency = (amount: number) => `${amount.toFixed(2)} EUR`;

    // Generate QR code URL (using a free QR code API)
    const qrData = encodeURIComponent(JSON.stringify({
        reservationId: data.reservation.id,
        transactionId: data.transaction.id,
        customerEmail: data.customerEmail
    }));
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

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
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #1f2937;
                    line-height: 1.4;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                }
                .container {
                    max-width: 700px;
                    margin: 0 auto;
                    background: #fff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px;
                    text-align: center;
                }
                .logo {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .logo img {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 10px;
                }
                .subtitle {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 16px;
                }
                .content {
                    padding: 40px;
                }
                .ticket-info {
                    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
                    padding: 30px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                }
                .ticket-info h2 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: #667eea;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #e0e0e0;
                }
                .info-row:last-child {
                    border-bottom: none;
                }
                .info-label {
                    font-weight: 600;
                    color: #666;
                    font-size: 14px;
                }
                .info-value {
                    font-weight: 700;
                    color: #1f2937;
                    font-size: 16px;
                }
                .flights-section {
                    margin-bottom: 30px;
                }
                .flights-section h3 {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: #764ba2;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .flight-card {
                    background: #fff;
                    border: 2px solid #667eea;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 15px;
                }
                .flight-route {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                .airport {
                    text-align: center;
                }
                .airport-code {
                    font-size: 28px;
                    font-weight: 700;
                    color: #667eea;
                }
                .airport-name {
                    font-size: 12px;
                    color: #666;
                    margin-top: 5px;
                }
                .flight-arrow {
                    font-size: 24px;
                    color: #764ba2;
                }
                .flight-details {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    text-align: center;
                    padding-top: 15px;
                    border-top: 1px solid #e0e0e0;
                }
                .flight-detail-item strong {
                    display: block;
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 5px;
                }
                .flight-detail-item span {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1f2937;
                }
                .passengers-section {
                    margin-bottom: 30px;
                }
                .passengers-section h3 {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: #764ba2;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .passenger-list {
                    background: #f5f7fa;
                    border-radius: 12px;
                    padding: 20px;
                }
                .passenger-item {
                    padding: 12px 0;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    align-items: center;
                }
                .passenger-item:last-child {
                    border-bottom: none;
                }
                .passenger-number {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #fff;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    margin-right: 15px;
                    font-size: 14px;
                }
                .passenger-name {
                    font-weight: 600;
                    font-size: 16px;
                }
                .qr-section {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 30px;
                }
                .qr-code {
                    text-align: center;
                }
                .qr-code img {
                    border: 3px solid #667eea;
                    border-radius: 12px;
                    padding: 10px;
                    background: #fff;
                }
                .qr-code p {
                    margin-top: 10px;
                    font-size: 12px;
                    color: #666;
                }
                .disclaimer {
                    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
                    border-left: 4px solid #f59e0b;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .disclaimer strong {
                    color: #92400e;
                    font-weight: 700;
                    display: block;
                    margin-bottom: 8px;
                }
                .disclaimer p {
                    color: #78350f;
                    font-size: 13px;
                    margin-bottom: 5px;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    background: #f5f7fa;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">
                        <img src="${data.frontendUrl}/blue-logo-letters.png" 
                             alt="Skylimit Logo">
                    </div>
                    <div class="subtitle">Billete Electrónico</div>
                </div>

                <div class="content">
                    <div class="ticket-info">
                        <h2>Reserva #${data.reservation.id}</h2>
                        <div class="info-row">
                            <span class="info-label">Estado</span>
                            <span class="info-value">${data.reservation.status}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Clase</span>
                            <span class="info-value">${data.reservation.travelClass}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Precio Total</span>
                            <span class="info-value">${formatCurrency(data.reservation.price)}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Fecha de Emisión</span>
                            <span class="info-value">${formatDate(new Date())}</span>
                        </div>
                    </div>

                    <div class="flights-section">
                        <h3>Tramos de Vuelo</h3>
                        ${data.reservation.reservationFlights.map((reservationFlight: any, index: number) => `
                            <div class="flight-card">
                                <div class="flight-route">
                                    <div class="airport">
                                        <div class="airport-code">${reservationFlight.flight.airportDeparture.iata}</div>
                                        <div class="airport-name">${reservationFlight.flight.airportDeparture.city || 'Origen'}</div>
                                    </div>
                                    <div class="flight-arrow">✈</div>
                                    <div class="airport">
                                        <div class="airport-code">${reservationFlight.flight.airportArrival.iata}</div>
                                        <div class="airport-name">${reservationFlight.flight.airportArrival.city || 'Destino'}</div>
                                    </div>
                                </div>
                                <div class="flight-details">
                                    <div class="flight-detail-item">
                                        <strong>Fecha</strong>
                                        <span>${formatDate(new Date(reservationFlight.flight.departureDateTime))}</span>
                                    </div>
                                    <div class="flight-detail-item">
                                        <strong>Aerolínea</strong>
                                        <span>${reservationFlight.flight.airline}</span>
                                    </div>
                                    <div class="flight-detail-item">
                                        <strong>Vuelo</strong>
                                        <span>${reservationFlight.flight.flightNumber || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="passengers-section">
                        <h3>Pasajeros (${data.reservation.passengers.length})</h3>
                        <div class="passenger-list">
                            ${data.reservation.passengers.map((passenger: any, index: number) => `
                                <div class="passenger-item">
                                    <div class="passenger-number">${index + 1}</div>
                                    <div class="passenger-name">${passenger.name} ${passenger.surname}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="qr-section">
                        <div class="qr-code">
                            <img src="${qrUrl}" alt="QR Code" width="150" height="150">
                            <p>Escanear para verificar reserva</p>
                        </div>
                    </div>

                    <div class="disclaimer">
                        <strong>⚠ AVISO IMPORTANTE</strong>
                        <p>Este billete es meramente académico y no tiene validez legal ni comercial.</p>
                        <p>No permite embarque ni uso comercial en la vida real.</p>
                        <p>Es un documento de prueba generado para fines educativos.</p>
                    </div>
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
