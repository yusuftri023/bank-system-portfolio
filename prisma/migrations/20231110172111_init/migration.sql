/*
  Warnings:

  - Made the column `phone_number` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "users_user_name_key";

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "profile_picture" TEXT,
ALTER COLUMN "phone_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "user_name" DROP NOT NULL,
ALTER COLUMN "user_name" SET DATA TYPE TEXT,
ALTER COLUMN "identity_number" SET DATA TYPE TEXT;

-- RenameIndex
ALTER INDEX "profiles_identity_number" RENAME TO "users_identity_number_key";
