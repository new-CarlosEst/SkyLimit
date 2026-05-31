import { useEffect, useState } from "react";
import { getUserReservations, type UserReservation } from "../../../api/reservation.api";
import IconoirCalendar from "../../../assets/ui/IconoirCalendar.svg";
import "./UserReservations.css";

function UserReservations() {
    const [reservations, setReservations] = useState<UserReservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data = await getUserReservations();
                setReservations(data);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const toggleExpand = (id: number) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const getPaymentStatus = (reservation: UserReservation) => {
        const transaction = reservation.transactions[0];
        if (!transaction) {
            return { status: "PENDING", label: "Pendiente", color: "yellow" };
        }

        switch (transaction.status) {
            case "COMPLETED":
                return { status: "PAID", label: "Pagada", color: "green" };
            case "PENDING":
                return { status: "PENDING", label: "Pendiente", color: "yellow" };
            case "FAILED":
                return { status: "FAILED", label: "Fallida", color: "red" };
            case "REFUNDED":
                return { status: "REFUNDED", label: "Reembolsada", color: "gray" };
            case "CANCELLED":
                return { status: "CANCELLED", label: "Cancelada", color: "red" };
            default:
                return { status: "PENDING", label: "Pendiente", color: "yellow" };
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

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
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
                    const isExpanded = expandedIds.has(reservation.id);
                    const firstFlight = reservation.reservationFlights[0];
                    const lastFlight = reservation.reservationFlights[reservation.reservationFlights.length - 1];
                    const isRoundTrip = reservation.reservationFlights.length > 1;

                    return (
                        <div key={reservation.id} className="reservation-card">
                            {/* Collapsed summary */}
                            <div className="flex items-center justify-between gap-4">
                                {/* Route summary */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-gray-900">
                                            {firstFlight?.flight.airportDeparture.iata}
                                        </span>
                                        <span className="text-gray-400 text-sm">
                                            {isRoundTrip ? "⇄" : "→"}
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {lastFlight?.flight.airportArrival.iata}
                                        </span>
                                    </div>
                                    <span className="hidden sm:inline text-sm text-gray-400">|</span>
                                    <span className="hidden sm:inline text-sm text-gray-500">
                                        {formatDate(reservation.reservationDate)}
                                    </span>
                                    <span className="hidden sm:inline text-sm text-gray-400">|</span>
                                    <span className="hidden sm:inline text-sm text-gray-500">
                                        {reservation.passengers.length} pax · {reservation.travelClass}
                                    </span>
                                </div>

                                {/* Price + status + toggle */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-base font-bold text-blue-600">
                                        {reservation.price.toFixed(2)} €
                                    </span>
                                    <span className={`payment-status payment-status-${paymentStatus.color}`}>
                                        {paymentStatus.label}
                                    </span>
                                    <button
                                        onClick={() => toggleExpand(reservation.id)}
                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                                        aria-label={isExpanded ? "Colapsar" : "Expandir"}
                                    >
                                        <svg
                                            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Expanded details */}
                            {isExpanded && (
                                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3">
                                    {/* Flights */}
                                    <div className="reservation-flights">
                                        {reservation.reservationFlights.map((rf) => (
                                            <div key={rf.id} className="flight-leg">
                                                <div className="flight-departure">
                                                    <span className="airport-code">{rf.flight.airportDeparture.iata}</span>
                                                    <span className="airport-city">{rf.flight.airportDeparture.city}</span>
                                                    <span className="flight-time">{formatDateTime(rf.flight.departureDateTime)}</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 px-4">
                                                    <span className="text-xs text-gray-400">Sin escalas</span>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-12 h-px bg-gray-300"></div>
                                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>
                                                        </svg>
                                                        <div className="w-12 h-px bg-gray-300"></div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {formatTime(rf.flight.departureDateTime)} → {formatTime(rf.flight.arrivalDateTime)}
                                                    </span>
                                                </div>
                                                <div className="flight-arrival text-right">
                                                    <span className="airport-code">{rf.flight.airportArrival.iata}</span>
                                                    <span className="airport-city">{rf.flight.airportArrival.city}</span>
                                                    <span className="flight-time">{formatDateTime(rf.flight.arrivalDateTime)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Details row */}
                                    <div className="reservation-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Reserva</span>
                                            <span className="detail-value">#{reservation.id}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Fecha</span>
                                            <span className="detail-value">{formatDate(reservation.reservationDate)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Clase</span>
                                            <span className="detail-value">{reservation.travelClass}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Pasajeros</span>
                                            <span className="detail-value">{reservation.passengers.length}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Total</span>
                                            <span className="detail-value price">{reservation.price.toFixed(2)} €</span>
                                        </div>
                                    </div>

                                    {/* Transaction */}
                                    {reservation.transactions.length > 0 && (
                                        <div className="transaction-info">
                                            <span className="transaction-label">
                                                Pagado con {reservation.transactions[0].cardBrand} •••• {reservation.transactions[0].cardLast4}
                                            </span>
                                        </div>
                                    )}
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
