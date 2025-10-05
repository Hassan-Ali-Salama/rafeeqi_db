/*
  Warnings:

  - A unique constraint covering the columns `[pairing_code]` on the table `Elder_Details` will be added. If there are existing duplicate values, this will fail.
  - The required column `pairing_code` was added to the `Elder_Details` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Elder_Details" ADD COLUMN     "pairing_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Elder_Details_pairing_code_key" ON "Elder_Details"("pairing_code");
