/*
  Warnings:

  - You are about to drop the `tb_emblemas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_emblemas_usuarios` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idPost` to the `Tb_avaliacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoPost` to the `Tb_avaliacoes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tb_emblemas_usuarios` DROP FOREIGN KEY `Tb_emblemas_usuarios_idEmb_fkey`;

-- DropForeignKey
ALTER TABLE `tb_emblemas_usuarios` DROP FOREIGN KEY `Tb_emblemas_usuarios_idUsu_fkey`;

-- AlterTable
ALTER TABLE `tb_avaliacoes` ADD COLUMN `idPost` INTEGER NOT NULL,
    ADD COLUMN `tipoPost` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `tb_emblemas`;

-- DropTable
DROP TABLE `tb_emblemas_usuarios`;
