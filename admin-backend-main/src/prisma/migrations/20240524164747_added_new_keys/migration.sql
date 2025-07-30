-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "conversationCompletionTokens" INTEGER,
ADD COLUMN     "conversationPromptTokens" INTEGER,
ADD COLUMN     "securityCompletionTokens" INTEGER,
ADD COLUMN     "securityPromptTokens" INTEGER;
