-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "chatbot_json" TEXT;
-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "query_kb" INTEGER;
-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "security_violations" INTEGER,
ADD COLUMN     "total_token_usage" INTEGER;
-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "chatbot_json",
DROP COLUMN "query_kb",
ADD COLUMN     "query_knowledgebase" INTEGER;
-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "query_knowledgebase",
ADD COLUMN     "queryKnowLedgebase" INTEGER;
-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "queryKnowLedgebase",
ADD COLUMN     "queryKnowledgebase" INTEGER;
-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "completionTokens" INTEGER,
ADD COLUMN     "promptTokens" INTEGER;
-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "completionTokens",
DROP COLUMN "promptTokens";
-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "security_violations",
ADD COLUMN     "securityViolations" INTEGER;
-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "total_token_usage";
