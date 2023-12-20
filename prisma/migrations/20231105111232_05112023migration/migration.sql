-- CreateEnum
CREATE TYPE "identitas" AS ENUM ('KTP', 'SIM', 'Passport');

-- CreateEnum
CREATE TYPE "jenis" AS ENUM ('Deposit', 'Withdraw', 'Transfer');

-- CreateTable
CREATE TABLE "accounts" (
    "account_id" SERIAL NOT NULL,
    "account_number" SERIAL NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 100000,
    "user_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "profile_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "phone_number" TEXT,
    "identity_type" "identitas",
    "address" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" SERIAL NOT NULL,
    "transaction_type" "jenis",
    "amount" DECIMAL(15,2),
    "transaction_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(0),
    "destination_id" INTEGER,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "user_name" VARCHAR(100) NOT NULL,
    "identity_number" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_identity_number" ON "users"("identity_number");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "fk_transactions_accounts" FOREIGN KEY ("destination_id") REFERENCES "accounts"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "fk_transactions_accounts2" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
