UPDATE "Interaction"
SET "sentiment" = 'neutral'
WHERE "sentiment" = 'נייטרלי';

UPDATE "Interaction"
SET "sentiment" = 'positive'
WHERE "sentiment" = 'חיובי';

UPDATE "Interaction"
SET "sentiment" = 'negative'
WHERE "sentiment" = 'שלילי';