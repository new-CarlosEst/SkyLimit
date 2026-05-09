/*
  Warnings:

  - You are about to drop the column `gate` on the `Flight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "gate",
ADD COLUMN     "flightDuration" INTEGER,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'Created';
