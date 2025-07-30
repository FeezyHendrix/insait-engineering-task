-- This is an empty migration.
WITH message_counts AS (
  SELECT 
    "conversationId", 
    COUNT(*) AS message_count
  FROM 
    "Interaction",
    LATERAL (SELECT jsonb_array_elements(messages) AS elements) AS expanded_messages
  WHERE 
    "messageCount" IS NULL
  GROUP BY 
    "conversationId"
)
UPDATE "Interaction" AS i
SET "messageCount" = mc.message_count
FROM message_counts AS mc
WHERE i."conversationId" = mc."conversationId";

