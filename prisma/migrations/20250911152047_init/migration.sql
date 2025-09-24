/*
  Warnings:

  - You are about to drop the `rooms` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[requestNumber]` on the table `room_requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `requestNumber` to the `room_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `room_requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ServiceType" AS ENUM ('service', 'room');

-- AlterEnum
ALTER TYPE "public"."RequestStatus" ADD VALUE 'FINISH';

-- DropForeignKey
ALTER TABLE "public"."room_requests" DROP CONSTRAINT "room_requests_roomId_fkey";

-- DropIndex
DROP INDEX "public"."room_requests_roomId_startAt_endAt_idx";

-- AlterTable
ALTER TABLE "public"."request_attachments" ALTER COLUMN "fileName" DROP NOT NULL,
ALTER COLUMN "originalName" DROP NOT NULL,
ALTER COLUMN "mimeType" DROP NOT NULL,
ALTER COLUMN "sizeBytes" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."room_requests" ADD COLUMN     "additionalRequirements" TEXT,
ADD COLUMN     "addressLine" VARCHAR(255),
ADD COLUMN     "attendeesCount" INTEGER,
ADD COLUMN     "borrowerEmail" VARCHAR(150),
ADD COLUMN     "borrowerName" VARCHAR(100),
ADD COLUMN     "borrowerOrganization" VARCHAR(150),
ADD COLUMN     "borrowerPhone" VARCHAR(30),
ADD COLUMN     "city" VARCHAR(100),
ADD COLUMN     "district" VARCHAR(100),
ADD COLUMN     "equipment" JSONB,
ADD COLUMN     "isOffsite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "postalCode" VARCHAR(20),
ADD COLUMN     "province" VARCHAR(100),
ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "rejectedById" VARCHAR(36),
ADD COLUMN     "rejectionReason" VARCHAR(255),
ADD COLUMN     "requestNumber" VARCHAR(30) NOT NULL,
ADD COLUMN     "requireCatering" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requireItSupport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE "public"."services" ADD COLUMN     "type" "public"."ServiceType" NOT NULL DEFAULT 'service';

-- DropTable
DROP TABLE "public"."rooms";

-- CreateIndex
CREATE UNIQUE INDEX "room_requests_requestNumber_key" ON "public"."room_requests"("requestNumber");

-- CreateIndex
CREATE INDEX "room_requests_status_startAt_idx" ON "public"."room_requests"("status", "startAt");

-- AddForeignKey
ALTER TABLE "public"."room_requests" ADD CONSTRAINT "room_requests_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."room_requests" ADD CONSTRAINT "room_requests_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
