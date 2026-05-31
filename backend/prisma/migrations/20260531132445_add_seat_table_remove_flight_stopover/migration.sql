/*
  Warnings:

  - You are about to drop the column `airportStopoverId` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the `FlightStopover` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FareType" AS ENUM ('BASIC', 'CLASSIC');

-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_airportStopoverId_fkey";

-- DropForeignKey
ALTER TABLE "FlightStopover" DROP CONSTRAINT "FlightStopover_flightId_fkey";

-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "airportStopoverId";

-- DropTable
DROP TABLE "FlightStopover";

-- CreateTable
CREATE TABLE "Seat" (
    "id" SERIAL NOT NULL,
    "seatNumber" TEXT NOT NULL,
    "cabin" TEXT NOT NULL,
    "fareType" "FareType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "passengerId" INTEGER,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seat_passengerId_key" ON "Seat"("passengerId");

-- CreateIndex
CREATE INDEX "Seat_reservationId_idx" ON "Seat"("reservationId");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger"("id") ON DELETE SET NULL ON UPDATE CASCADE;
