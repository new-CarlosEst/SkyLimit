/*
  Warnings:

  - You are about to drop the column `flightId` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_flightId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "flightId";

-- CreateTable
CREATE TABLE "ReservationFlight" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "flightId" INTEGER NOT NULL,

    CONSTRAINT "ReservationFlight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReservationFlight_reservationId_idx" ON "ReservationFlight"("reservationId");

-- CreateIndex
CREATE INDEX "ReservationFlight_flightId_idx" ON "ReservationFlight"("flightId");

-- AddForeignKey
ALTER TABLE "ReservationFlight" ADD CONSTRAINT "ReservationFlight_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationFlight" ADD CONSTRAINT "ReservationFlight_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
