import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "post" ADD COLUMN "header_image_mode" varchar DEFAULT 'cover';
    ALTER TABLE "_post_v" ADD COLUMN "version_header_image_mode" varchar DEFAULT 'cover';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "post" DROP COLUMN "header_image_mode";
    ALTER TABLE "_post_v" DROP COLUMN "version_header_image_mode";
  `)
}
