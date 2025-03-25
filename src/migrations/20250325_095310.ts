import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "forms_blocks_checkbox_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  ALTER TABLE "term" ADD COLUMN "show_hero" boolean;
  ALTER TABLE "_term_v" ADD COLUMN "version_show_hero" boolean;
  ALTER TABLE "forms" ADD COLUMN "show_title" boolean DEFAULT true;
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_checkbox_options" ADD CONSTRAINT "forms_blocks_checkbox_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_options_order_idx" ON "forms_blocks_checkbox_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_options_parent_id_idx" ON "forms_blocks_checkbox_options" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "forms_blocks_checkbox_options" CASCADE;
  ALTER TABLE "term" DROP COLUMN IF EXISTS "show_hero";
  ALTER TABLE "_term_v" DROP COLUMN IF EXISTS "version_show_hero";
  ALTER TABLE "forms" DROP COLUMN IF EXISTS "show_title";`)
}
