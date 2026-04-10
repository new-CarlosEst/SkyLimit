-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "favoriteAirportId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" SERIAL NOT NULL,
    "holderName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "cvv" TEXT NOT NULL,
    "last4Digits" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "reservationId" INTEGER,
    "paymentMethodId" INTEGER,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "reservationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "travelClass" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "flightId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passenger" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "passengerId" INTEGER NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" SERIAL NOT NULL,
    "iata" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" SERIAL NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "gate" TEXT,
    "departureDateTime" TIMESTAMP(3) NOT NULL,
    "arrivalDateTime" TIMESTAMP(3) NOT NULL,
    "stopoverCount" INTEGER,
    "airportDepartureId" INTEGER NOT NULL,
    "airportArrivalId" INTEGER NOT NULL,
    "airportStopoverId" INTEGER,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PassengerToReservation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PassengerToReservation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_iata_key" ON "Airport"("iata");

-- CreateIndex
CREATE INDEX "_PassengerToReservation_B_index" ON "_PassengerToReservation"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_favoriteAirportId_fkey" FOREIGN KEY ("favoriteAirportId") REFERENCES "Airport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_airportDepartureId_fkey" FOREIGN KEY ("airportDepartureId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_airportArrivalId_fkey" FOREIGN KEY ("airportArrivalId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_airportStopoverId_fkey" FOREIGN KEY ("airportStopoverId") REFERENCES "Airport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PassengerToReservation" ADD CONSTRAINT "_PassengerToReservation_A_fkey" FOREIGN KEY ("A") REFERENCES "Passenger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PassengerToReservation" ADD CONSTRAINT "_PassengerToReservation_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
