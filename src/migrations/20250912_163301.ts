import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_calculator_services_sections_services_options" ADD COLUMN "description" jsonb;
  ALTER TABLE "settings_calculator_services_sections_services" ADD COLUMN "description" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_calculator_services_sections_services_options" DROP COLUMN "description";
  ALTER TABLE "settings_calculator_services_sections_services" DROP COLUMN "description";`)
}
