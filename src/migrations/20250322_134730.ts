import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "project" ADD COLUMN "card_cover_id" uuid;
  ALTER TABLE "_project_v" ADD COLUMN "version_card_cover_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "project" ADD CONSTRAINT "project_card_cover_id_media_id_fk" FOREIGN KEY ("card_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_project_v" ADD CONSTRAINT "_project_v_version_card_cover_id_media_id_fk" FOREIGN KEY ("version_card_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "project_card_cover_idx" ON "project" USING btree ("card_cover_id");
  CREATE INDEX IF NOT EXISTS "_project_v_version_version_card_cover_idx" ON "_project_v" USING btree ("version_card_cover_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "project" DROP CONSTRAINT "project_card_cover_id_media_id_fk";
  
  ALTER TABLE "_project_v" DROP CONSTRAINT "_project_v_version_card_cover_id_media_id_fk";
  
  DROP INDEX IF EXISTS "project_card_cover_idx";
  DROP INDEX IF EXISTS "_project_v_version_version_card_cover_idx";
  ALTER TABLE "project" DROP COLUMN IF EXISTS "card_cover_id";
  ALTER TABLE "_project_v" DROP COLUMN IF EXISTS "version_card_cover_id";`)
}
