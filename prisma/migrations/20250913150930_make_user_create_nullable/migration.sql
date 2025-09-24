-- AlterTable
ALTER TABLE "public"."schedules" ALTER COLUMN "userCreate" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
