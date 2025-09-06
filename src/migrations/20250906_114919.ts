import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_calculator_services_sections_services" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "calculator_area_settings_description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_calculator_services_sections_services" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "settings" DROP COLUMN "calculator_area_settings_description";`)
}
