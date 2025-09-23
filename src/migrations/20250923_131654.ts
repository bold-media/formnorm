import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calculator_results" ADD COLUMN "contact_info_telegram_chat_id" varchar;
  ALTER TABLE "calculator_results" ADD COLUMN "send_to_telegram" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calculator_results" DROP COLUMN "contact_info_telegram_chat_id";
  ALTER TABLE "calculator_results" DROP COLUMN "send_to_telegram";`)
}
