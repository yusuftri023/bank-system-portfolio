/*
  Warnings:

  - The `identity_type` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `transaction_type` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "identity_card" AS ENUM ('KTP', 'SIM', 'Passport');

-- CreateEnum
CREATE TYPE "transactionType" AS ENUM ('Deposit', 'Withdraw', 'Transfer');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('Open', 'Closed');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('Admin', 'User');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "role" "role",
ADD COLUMN     "status" "status",
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "identity_type",
ADD COLUMN     "identity_type" "identity_card";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "transaction_type",
ADD COLUMN     "transaction_type" "transactionType";

-- DropEnum
DROP TYPE "identitas";

-- DropEnum
DROP TYPE "jenis";
