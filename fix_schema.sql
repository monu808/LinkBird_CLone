-- Fix emailVerified column type
ALTER TABLE "user" DROP COLUMN "emailVerified";
ALTER TABLE "user" ADD COLUMN "emailVerified" boolean DEFAULT false;

-- Set email column to NOT NULL
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;
