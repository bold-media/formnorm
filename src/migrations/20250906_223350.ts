import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "calculator_results" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"calculation_number" varchar,
  	"client_name" varchar,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"calculation_summary_area" numeric,
  	"calculation_summary_selected_floor" varchar,
  	"calculation_summary_total_cost" numeric,
  	"selected_services" varchar,
  	"additional_elements" varchar,
  	"metadata" jsonb,
  	"notes" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "calculator_results_id" uuid;
  ALTER TABLE "settings" ADD COLUMN "seo_calculator_title" varchar;
  ALTER TABLE "settings" ADD COLUMN "seo_calculator_description" varchar;
  ALTER TABLE "settings" ADD COLUMN "seo_calculator_image_id" uuid;
  ALTER TABLE "settings" ADD COLUMN "seo_calculator_canonical_u_r_l" varchar;
  ALTER TABLE "settings" ADD COLUMN "seo_calculator_no_index" boolean DEFAULT false;
  CREATE UNIQUE INDEX "calculator_results_calculation_number_idx" ON "calculator_results" USING btree ("calculation_number");
  CREATE INDEX "calculator_results_updated_at_idx" ON "calculator_results" USING btree ("updated_at");
  CREATE INDEX "calculator_results_created_at_idx" ON "calculator_results" USING btree ("created_at");
  CREATE UNIQUE INDEX "calculator_results_filename_idx" ON "calculator_results" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_calculator_results_fk" FOREIGN KEY ("calculator_results_id") REFERENCES "public"."calculator_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_seo_calculator_image_id_media_id_fk" FOREIGN KEY ("seo_calculator_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_calculator_results_id_idx" ON "payload_locked_documents_rels" USING btree ("calculator_results_id");
  CREATE INDEX "settings_seo_calculator_seo_calculator_image_idx" ON "settings" USING btree ("seo_calculator_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calculator_results" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "calculator_results" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_calculator_results_fk";
  
  ALTER TABLE "settings" DROP CONSTRAINT "settings_seo_calculator_image_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_calculator_results_id_idx";
  DROP INDEX "settings_seo_calculator_seo_calculator_image_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "calculator_results_id";
  ALTER TABLE "settings" DROP COLUMN "seo_calculator_title";
  ALTER TABLE "settings" DROP COLUMN "seo_calculator_description";
  ALTER TABLE "settings" DROP COLUMN "seo_calculator_image_id";
  ALTER TABLE "settings" DROP COLUMN "seo_calculator_canonical_u_r_l";
  ALTER TABLE "settings" DROP COLUMN "seo_calculator_no_index";`)
}
