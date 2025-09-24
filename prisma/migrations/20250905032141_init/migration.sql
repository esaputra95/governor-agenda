-- CreateEnum
CREATE TYPE "public"."AttachmentType" AS ENUM ('IMAGE', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "public"."AttachmentCategory" AS ENUM ('REQUEST_FORM', 'APPROVAL_DOCUMENT', 'EVENT_PROOF', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PARTIALLY_APPROVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ServiceApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PARTIALLY_APPROVED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "role" VARCHAR(50),
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rooms" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "location" VARCHAR(150),
    "capacity" INTEGER,
    "facilities" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."services" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "unit" VARCHAR(30),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "maxPerRequest" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."room_requests" (
    "id" VARCHAR(36) NOT NULL,
    "requesterId" VARCHAR(36) NOT NULL,
    "roomId" VARCHAR(36) NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "purpose" VARCHAR(255),
    "note" VARCHAR(255),
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "approvedById" VARCHAR(36),
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."room_request_services" (
    "id" VARCHAR(36) NOT NULL,
    "roomRequestId" VARCHAR(36) NOT NULL,
    "serviceId" VARCHAR(36) NOT NULL,
    "requestedQty" INTEGER NOT NULL,
    "approvedQty" INTEGER,
    "status" "public"."ServiceApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "approverId" VARCHAR(36),
    "approvalNote" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_request_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."request_attachments" (
    "id" VARCHAR(36) NOT NULL,
    "roomRequestId" VARCHAR(36) NOT NULL,
    "roomRequestServiceId" VARCHAR(36),
    "type" "public"."AttachmentType" NOT NULL,
    "category" "public"."AttachmentCategory" NOT NULL DEFAULT 'OTHER',
    "fileName" VARCHAR(200) NOT NULL,
    "originalName" VARCHAR(200) NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "storageBucket" VARCHAR(100),
    "checksum" VARCHAR(128),
    "width" INTEGER,
    "height" INTEGER,
    "exif" JSONB,
    "uploadedById" VARCHAR(36),
    "note" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "request_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_name_key" ON "public"."rooms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "public"."services"("name");

-- CreateIndex
CREATE INDEX "room_requests_roomId_startAt_endAt_idx" ON "public"."room_requests"("roomId", "startAt", "endAt");

-- CreateIndex
CREATE INDEX "room_requests_requesterId_startAt_idx" ON "public"."room_requests"("requesterId", "startAt");

-- CreateIndex
CREATE UNIQUE INDEX "room_request_services_roomRequestId_serviceId_key" ON "public"."room_request_services"("roomRequestId", "serviceId");

-- CreateIndex
CREATE INDEX "request_attachments_roomRequestId_category_idx" ON "public"."request_attachments"("roomRequestId", "category");

-- CreateIndex
CREATE INDEX "request_attachments_roomRequestServiceId_idx" ON "public"."request_attachments"("roomRequestServiceId");

-- CreateIndex
CREATE INDEX "request_attachments_type_idx" ON "public"."request_attachments"("type");

-- AddForeignKey
ALTER TABLE "public"."room_requests" ADD CONSTRAINT "room_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."room_requests" ADD CONSTRAINT "room_requests_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."room_requests" ADD CONSTRAINT "room_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."room_request_services" ADD CONSTRAINT "room_request_services_roomRequestId_fkey" FOREIGN KEY ("roomRequestId") REFERENCES "public"."room_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."room_request_services" ADD CONSTRAINT "room_request_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."room_request_services" ADD CONSTRAINT "room_request_services_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_attachments" ADD CONSTRAINT "request_attachments_roomRequestId_fkey" FOREIGN KEY ("roomRequestId") REFERENCES "public"."room_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_attachments" ADD CONSTRAINT "request_attachments_roomRequestServiceId_fkey" FOREIGN KEY ("roomRequestServiceId") REFERENCES "public"."room_request_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_attachments" ADD CONSTRAINT "request_attachments_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
