import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_rels" ADD COLUMN "service_id" uuid;
  ALTER TABLE "settings_rels" ADD COLUMN "term_id" uuid;
  ALTER TABLE "settings_rels" ADD COLUMN "post_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_service_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_term_fk" FOREIGN KEY ("term_id") REFERENCES "public"."term"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_post_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "settings_rels_service_id_idx" ON "settings_rels" USING btree ("service_id");
  CREATE INDEX IF NOT EXISTS "settings_rels_term_id_idx" ON "settings_rels" USING btree ("term_id");
  CREATE INDEX IF NOT EXISTS "settings_rels_post_id_idx" ON "settings_rels" USING btree ("post_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_rels" DROP CONSTRAINT "settings_rels_service_fk";
  
  ALTER TABLE "settings_rels" DROP CONSTRAINT "settings_rels_term_fk";
  
  ALTER TABLE "settings_rels" DROP CONSTRAINT "settings_rels_post_fk";
  
  DROP INDEX IF EXISTS "settings_rels_service_id_idx";
  DROP INDEX IF EXISTS "settings_rels_term_id_idx";
  DROP INDEX IF EXISTS "settings_rels_post_id_idx";
  ALTER TABLE "settings_rels" DROP COLUMN IF EXISTS "service_id";
  ALTER TABLE "settings_rels" DROP COLUMN IF EXISTS "term_id";
  ALTER TABLE "settings_rels" DROP COLUMN IF EXISTS "post_id";`)
}
