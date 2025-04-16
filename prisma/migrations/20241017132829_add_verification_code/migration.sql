-- AlterTable
ALTER TABLE `tb_usuarios` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verificationCode` INTEGER NULL;
