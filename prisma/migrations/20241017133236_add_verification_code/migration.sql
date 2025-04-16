/*
  Warnings:

  - You are about to drop the column `isVerified` on the `tb_usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCode` on the `tb_usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tb_usuarios` DROP COLUMN `isVerified`,
    DROP COLUMN `verificationCode`;
