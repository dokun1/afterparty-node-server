-- Rename password → password_hash in events
ALTER TABLE "events" RENAME COLUMN "password" TO "password_hash";
--> statement-breakpoint
-- Add missing indexes on refresh_tokens
CREATE UNIQUE INDEX "refresh_tokens_token_hash_idx" ON "refresh_tokens" USING btree ("token_hash");
--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens" USING btree ("user_id");
--> statement-breakpoint
-- Add missing indexes on admin_invites
CREATE INDEX "admin_invites_event_id_idx" ON "admin_invites" USING btree ("event_id");
--> statement-breakpoint
CREATE INDEX "admin_invites_invited_user_id_idx" ON "admin_invites" USING btree ("invited_user_id");
--> statement-breakpoint
-- Add missing index on passkey_credentials
CREATE INDEX "passkey_credentials_user_id_idx" ON "passkey_credentials" USING btree ("user_id");
--> statement-breakpoint
-- Add missing index on media
CREATE INDEX "media_uploaded_by_id_idx" ON "media" USING btree ("uploaded_by_id");
