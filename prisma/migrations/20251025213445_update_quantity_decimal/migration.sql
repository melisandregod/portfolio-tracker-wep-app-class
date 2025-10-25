/*
  Warnings:

  - You are about to alter the column `quantity` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,8)`.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(18,8);
