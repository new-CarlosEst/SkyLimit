/*
  Warnings:

  - Added the required column `airline` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "airline" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "FlightStopover" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "arrivalDateTime" TIMESTAMP(3) NOT NULL,
    "departureDateTime" TIMESTAMP(3) NOT NULL,
    "flightId" INTEGER NOT NULL,

    CONSTRAINT "FlightStopover_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FlightStopover" ADD CONSTRAINT "FlightStopover_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
