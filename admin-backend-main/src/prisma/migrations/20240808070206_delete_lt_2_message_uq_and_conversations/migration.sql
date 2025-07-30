-- This is an empty migration.
DELETE FROM "UnansweredQuestion"
WHERE "conversationId" IN 
    ( SELECT "conversationId" 
    FROM "Interaction" 
    WHERE "messageCount" < 2 
    OR "messageCount" IS NULL );

DELETE FROM "Interaction"
WHERE "messageCount" < 2 OR "messageCount" IS NULL;