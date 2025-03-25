import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "post" ADD COLUMN "header_image_id" uuid;
  ALTER TABLE "post" ADD COLUMN "show_header_image" boolean DEFAULT true;
  ALTER TABLE "_post_v" ADD COLUMN "version_header_image_id" uuid;
  ALTER TABLE "_post_v" ADD COLUMN "version_show_header_image" boolean DEFAULT true;
  DO $$ BEGIN
   ALTER TABLE "post" ADD CONSTRAINT "post_header_image_id_media_id_fk" FOREIGN KEY ("header_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_post_v" ADD CONSTRAINT "_post_v_version_header_image_id_media_id_fk" FOREIGN KEY ("version_header_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "post_header_image_idx" ON "post" USING btree ("header_image_id");
  CREATE INDEX IF NOT EXISTS "_post_v_version_version_header_image_idx" ON "_post_v" USING btree ("version_header_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "post" DROP CONSTRAINT "post_header_image_id_media_id_fk";
  
  ALTER TABLE "_post_v" DROP CONSTRAINT "_post_v_version_header_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "post_header_image_idx";
  DROP INDEX IF EXISTS "_post_v_version_version_header_image_idx";
  ALTER TABLE "post" DROP COLUMN IF EXISTS "header_image_id";
  ALTER TABLE "post" DROP COLUMN IF EXISTS "show_header_image";
  ALTER TABLE "_post_v" DROP COLUMN IF EXISTS "version_header_image_id";
  ALTER TABLE "_post_v" DROP COLUMN IF EXISTS "version_show_header_image";`)
}
