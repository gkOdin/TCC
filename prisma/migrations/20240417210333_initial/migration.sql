-- CreateTable
CREATE TABLE `Tb_usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tb_usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tb_categoria` (
    `idCat` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeCat` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idCat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tb_perguntas` (
    `idPer` INTEGER NOT NULL AUTO_INCREMENT,
    `idCat` INTEGER NOT NULL,
    `idUsu` INTEGER NOT NULL,
    `tituloPer` VARCHAR(191) NOT NULL,
    `conteudoPer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idPer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tb_respostas` (
    `idRes` INTEGER NOT NULL AUTO_INCREMENT,
    `idPer` INTEGER NOT NULL,
    `idUsu` INTEGER NOT NULL,
    `conteudoRes` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idRes`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tb_emblemas` (
    `idEmb` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeEmb` VARCHAR(191) NOT NULL,
    `descricaoEmb` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idEmb`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tb_avaliacoes` (
    `idAva` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuAva` INTEGER NOT NULL,
    `tipoAva` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idAva`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tb_emblemas_usuarios` (
    `idRelacao` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsu` INTEGER NOT NULL,
    `idEmb` INTEGER NOT NULL,

    PRIMARY KEY (`idRelacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tb_perguntas` ADD CONSTRAINT `Tb_perguntas_idCat_fkey` FOREIGN KEY (`idCat`) REFERENCES `Tb_categoria`(`idCat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tb_perguntas` ADD CONSTRAINT `Tb_perguntas_idUsu_fkey` FOREIGN KEY (`idUsu`) REFERENCES `Tb_usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tb_respostas` ADD CONSTRAINT `Tb_respostas_idPer_fkey` FOREIGN KEY (`idPer`) REFERENCES `Tb_perguntas`(`idPer`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tb_respostas` ADD CONSTRAINT `Tb_respostas_idUsu_fkey` FOREIGN KEY (`idUsu`) REFERENCES `Tb_usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tb_avaliacoes` ADD CONSTRAINT `Tb_avaliacoes_idUsuAva_fkey` FOREIGN KEY (`idUsuAva`) REFERENCES `Tb_usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tb_emblemas_usuarios` ADD CONSTRAINT `Tb_emblemas_usuarios_idUsu_fkey` FOREIGN KEY (`idUsu`) REFERENCES `Tb_usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tb_emblemas_usuarios` ADD CONSTRAINT `Tb_emblemas_usuarios_idEmb_fkey` FOREIGN KEY (`idEmb`) REFERENCES `Tb_emblemas`(`idEmb`) ON DELETE RESTRICT ON UPDATE CASCADE;
