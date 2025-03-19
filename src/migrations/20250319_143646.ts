import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "service" ADD COLUMN "card_title" varchar;
  ALTER TABLE "_service_v" ADD COLUMN "version_card_title" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "service" DROP COLUMN IF EXISTS "card_title";
  ALTER TABLE "_service_v" DROP COLUMN IF EXISTS "version_card_title";`)
}
