-- AlterTable
CREATE TYPE "ChatChannel" AS ENUM ('WEB', 'WHATSAPP', 'SMS');

ALTER TABLE "Interaction" ADD COLUMN     "chatChannel"  "ChatChannel";
