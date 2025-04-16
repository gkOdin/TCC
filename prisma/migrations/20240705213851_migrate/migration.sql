/*
  Warnings:

  - Added the required column `arquivo` to the `Tb_usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_usuarios` ADD COLUMN `arquivo` VARCHAR(191) NOT NULL;
