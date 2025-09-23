import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calculator_results" RENAME COLUMN "contact_info_telegram_chat_id" TO "telegram_chat_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calculator_results" RENAME COLUMN "telegram_chat_id" TO "contact_info_telegram_chat_id";`)
}
