-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ELDER', 'CAREGIVER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Elder_Details" (
    "elder_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "caregiver_id" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "medical_history" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Elder_Details_pkey" PRIMARY KEY ("elder_id")
);

-- CreateTable
CREATE TABLE "Reading" (
    "reading_id" TEXT NOT NULL,
    "elder_id" TEXT NOT NULL,
    "reading_type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("reading_id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "medication_id" TEXT NOT NULL,
    "elder_id" TEXT NOT NULL,
    "med_name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("medication_id")
);

-- CreateTable
CREATE TABLE "SOS_Alerts" (
    "alert_id" TEXT NOT NULL,
    "issuer_id" TEXT NOT NULL,
    "alert_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SOS_Alerts_pkey" PRIMARY KEY ("alert_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Elder_Details_user_id_key" ON "Elder_Details"("user_id");

-- AddForeignKey
ALTER TABLE "Elder_Details" ADD CONSTRAINT "Elder_Details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Elder_Details" ADD CONSTRAINT "Elder_Details_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reading" ADD CONSTRAINT "Reading_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "Elder_Details"("elder_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "Elder_Details"("elder_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOS_Alerts" ADD CONSTRAINT "SOS_Alerts_issuer_id_fkey" FOREIGN KEY ("issuer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
