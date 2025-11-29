/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `activationtoken` DROP FOREIGN KEY `ActivationToken_userId_fkey`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `usuario` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `senhaHash` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT false,
    `ecopontos` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habito` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `pontos` INTEGER NOT NULL DEFAULT 10,
    `pergunta` VARCHAR(191) NOT NULL,
    `respostaCorreta` VARCHAR(191) NOT NULL,
    `respostaErrada` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habitouser` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `habitId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `habitouser_userId_habitId_key`(`userId`, `habitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habitolog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `habitId` VARCHAR(191) NOT NULL,
    `dataHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pontosGanhos` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `activationtoken` ADD CONSTRAINT `activationtoken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `habitouser` ADD CONSTRAINT `habitouser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `habitouser` ADD CONSTRAINT `habitouser_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `habito`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `habitolog` ADD CONSTRAINT `habitolog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `habitolog` ADD CONSTRAINT `habitolog_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `habito`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `activationtoken` RENAME INDEX `ActivationToken_token_key` TO `activationtoken_token_key`;

-- RenameIndex
ALTER TABLE `activationtoken` RENAME INDEX `ActivationToken_userId_key` TO `activationtoken_userId_key`;
