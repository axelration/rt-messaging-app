/*
  Warnings:

  - You are about to drop the `_ConversationMember` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `createdAt` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_ConversationMember" DROP CONSTRAINT "_ConversationMember_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationMember" DROP CONSTRAINT "_ConversationMember_B_fkey";

-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- DropTable
DROP TABLE "_ConversationMember";

-- CreateTable
CREATE TABLE "ConversationMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "isDeleted" TEXT DEFAULT '0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ConversationMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMember_userId_key" ON "ConversationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMember_conversationId_key" ON "ConversationMember"("conversationId");

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
