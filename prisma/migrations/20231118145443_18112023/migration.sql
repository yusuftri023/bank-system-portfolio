/*
  Warnings:

  - Made the column `email` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transaction_time` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `destination_account` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transaction_type` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `identity_number` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_destination_account_fkey";

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "phone_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "transaction_time" SET NOT NULL,
ALTER COLUMN "destination_account" SET NOT NULL,
ALTER COLUMN "transaction_type" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "user_name" SET NOT NULL,
ALTER COLUMN "identity_number" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_destination_account_fkey" FOREIGN KEY ("destination_account") REFERENCES "accounts"("account_number") ON DELETE RESTRICT ON UPDATE CASCADE;
