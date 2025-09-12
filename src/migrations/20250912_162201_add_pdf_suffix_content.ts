import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_calculator_services_sections_services_options" ALTER COLUMN "description" SET DATA TYPE jsonb;
  ALTER TABLE "settings_calculator_services_sections_services" ADD COLUMN "description" jsonb;
  ALTER TABLE "settings" ADD COLUMN "calculator_pdf_suffix_content_title" varchar;
  ALTER TABLE "settings" ADD COLUMN "calculator_pdf_suffix_content_content" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_calculator_services_sections_services_options" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "settings_calculator_services_sections_services" DROP COLUMN "description";
  ALTER TABLE "settings" DROP COLUMN "calculator_pdf_suffix_content_title";
  ALTER TABLE "settings" DROP COLUMN "calculator_pdf_suffix_content_content";`)
}
