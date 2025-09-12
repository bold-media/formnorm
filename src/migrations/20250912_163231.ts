import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" ADD COLUMN "calculator_pdf_suffix_content_title" varchar;
  ALTER TABLE "settings" ADD COLUMN "calculator_pdf_suffix_content_content" jsonb;
  ALTER TABLE "settings_calculator_services_sections_services_options" DROP COLUMN "description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_calculator_services_sections_services_options" ADD COLUMN "description" varchar;
  ALTER TABLE "settings" DROP COLUMN "calculator_pdf_suffix_content_title";
  ALTER TABLE "settings" DROP COLUMN "calculator_pdf_suffix_content_content";`)
}
