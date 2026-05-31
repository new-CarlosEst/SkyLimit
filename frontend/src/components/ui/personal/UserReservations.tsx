import { useEffect, useState } from "react";
import { getUserReservations, type UserReservation } from "../../../api/reservation.api";
import IconoirCalendar from "../../../assets/ui/IconoirCalendar.svg";
import "./UserReservations.css";

function UserReservations() {
    const [reservations, setReservations] = useState<UserReservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const data = await getUserReservations(token);
                    setReservations(data);
                }
            } catch (error) {
                console.error("Error fetching reservations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const getPaymentStatus = (reservation: UserReservation) => {
        const transaction = reservation.transactions[0];
        if (!transaction) {
            return { status: "PENDING", label: "Pendiente de pago", color: "yellow" };
        }

        switch (transaction.status) {
            case "COMPLETED":
                return { status: "PAID", label: "Pagada", color: "green" };
            case "PENDING":
                return { status: "PENDING", label: "Pendiente de pago", color: "yellow" };
            case "FAILED":
                return { status: "FAILED", label: "Fallida", color: "red" };
            case "REFUNDED":
                return { status: "REFUNDED", label: "Reembolsada", color: "gray" };
            case "CANCELLED":
                return { status: "CANCELLED", label: "Cancelada", color: "red" };
            default:
                return { status: "PENDING", label: "Pendiente de pago", color: "yellow" };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="card">
                <h2 className="card-title">Mis Reservas</h2>
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando reservas...</p>
                </div>
            </div>
        );
    }

    if (reservations.length === 0) {
        return (
            <div className="card">
                <h2 className="card-title">Mis Reservas</h2>
                <div className="empty-state">
                    <img src={IconoirCalendar} alt="Calendar" className="empty-icon" />
                    <p>No tienes reservas aún</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <h2 className="card-title">Mis Reservas</h2>
            <div className="reservations-list">
                {reservations.map((reservation) => {
                    const paymentStatus = getPaymentStatus(reservation);
                    return (
                        <div key={reservation.id} className="reservation-card">
                            <div className="reservation-header">
                                <div className="reservation-id">
                                    <span className="label">Reserva #{reservation.id}</span>
                                    <span className="date">{formatDate(reservation.reservationDate)}</span>
                                </div>
                                <div className={`payment-status payment-status-${paymentStatus.color}`}>
                                    {paymentStatus.label}
                                </div>
                            </div>

                            <div className="reservation-flights">
                                {reservation.reservationFlights.map((rf) => (
                                    <div key={rf.id} className="flight-leg">
                                        <div className="flight-departure">
                                            <span className="airport-code">{rf.flight.airportDeparture.iata}</span>
                                            <span className="airport-city">{rf.flight.airportDeparture.city}</span>
                                            <span className="flight-time">
                                                {formatDateTime(rf.flight.departureDateTime)}
                                            </span>
                                        </div>
                                        <div className="flight-arrow">→</div>
                                        <div className="flight-arrival">
                                            <span className="airport-code">{rf.flight.airportArrival.iata}</span>
                                            <span className="airport-city">{rf.flight.airportArrival.city}</span>
                                            <span className="flight-time">
                                                {formatDateTime(rf.flight.arrivalDateTime)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="reservation-details">
                                <div className="detail-item">
                                    <span className="detail-label">Clase:</span>
                                    <span className="detail-value">{reservation.travelClass}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Pasajeros:</span>
                                    <span className="detail-value">{reservation.passengers.length}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Precio total:</span>
                                    <span className="detail-value price">{reservation.price.toFixed(2)} €</span>
                                </div>
                            </div>

                            {reservation.transactions.length > 0 && (
                                <div className="transaction-info">
                                    <span className="transaction-label">
                                        Pagado con {reservation.transactions[0].cardBrand} •••• {reservation.transactions[0].cardLast4}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default UserReservations;
