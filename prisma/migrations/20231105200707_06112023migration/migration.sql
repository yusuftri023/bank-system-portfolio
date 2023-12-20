/*
  Warnings:

  - You are about to drop the column `account_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `destination_id` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[account_number]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `source_account` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "fk_transactions_accounts";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "fk_transactions_accounts2";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "account_id",
DROP COLUMN "destination_id",
ADD COLUMN     "destination_account" INTEGER,
ADD COLUMN     "source_account" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_account_number_key" ON "accounts"("account_number");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_destination_account_fkey" FOREIGN KEY ("destination_account") REFERENCES "accounts"("account_number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_source_account_fkey" FOREIGN KEY ("source_account") REFERENCES "accounts"("account_number") ON DELETE CASCADE ON UPDATE CASCADE;
