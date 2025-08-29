-- DropForeignKey
ALTER TABLE "public"."Return" DROP CONSTRAINT "Return_transactionId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Return" ADD CONSTRAINT "Return_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
