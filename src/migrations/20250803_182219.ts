import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "redirects" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" varchar DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"page_id" uuid,
  	"post_id" uuid,
  	"service_id" uuid,
  	"project_id" uuid,
  	"category_id" uuid,
  	"term_id" uuid
  );
  
  ALTER TABLE "page" ADD COLUMN "meta_canonical_u_r_l" varchar;
  ALTER TABLE "page" ADD COLUMN "meta_no_index" boolean DEFAULT false;
  ALTER TABLE "_page_v" ADD COLUMN "version_meta_canonical_u_r_l" varchar;
  ALTER TABLE "_page_v" ADD COLUMN "version_meta_no_index" boolean DEFAULT false;
  ALTER TABLE "post" ADD COLUMN "meta_canonical_u_r_l" varchar;
  ALTER TABLE "post" ADD COLUMN "meta_no_index" boolean DEFAULT false;
  ALTER TABLE "_post_v" ADD COLUMN "version_meta_canonical_u_r_l" varchar;
  ALTER TABLE "_post_v" ADD COLUMN "version_meta_no_index" boolean DEFAULT false;
  ALTER TABLE "project" ADD COLUMN "meta_canonical_u_r_l" varchar;
  ALTER TABLE "project" ADD COLUMN "meta_no_index" boolean DEFAULT false;
  ALTER TABLE "_project_v" ADD COLUMN "version_meta_canonical_u_r_l" varchar;
  ALTER TABLE "_project_v" ADD COLUMN "version_meta_no_index" boolean DEFAULT false;
  ALTER TABLE "term" ADD COLUMN "meta_canonical_u_r_l" varchar;
  ALTER TABLE "term" ADD COLUMN "meta_no_index" boolean DEFAULT false;
  ALTER TABLE "_term_v" ADD COLUMN "version_meta_canonical_u_r_l" varchar;
  ALTER TABLE "_term_v" ADD COLUMN "version_meta_no_index" boolean DEFAULT false;
  ALTER TABLE "service" ADD COLUMN "meta_canonical_u_r_l" varchar;
  ALTER TABLE "service" ADD COLUMN "meta_no_index" boolean DEFAULT false;
  ALTER TABLE "_service_v" ADD COLUMN "version_meta_canonical_u_r_l" varchar;
  ALTER TABLE "_service_v" ADD COLUMN "version_meta_no_index" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "redirects_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_page_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_post_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_service_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_project_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_category_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_term_fk" FOREIGN KEY ("term_id") REFERENCES "public"."term"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX IF NOT EXISTS "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "redirects_rels_page_id_idx" ON "redirects_rels" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_post_id_idx" ON "redirects_rels" USING btree ("post_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_service_id_idx" ON "redirects_rels" USING btree ("service_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_project_id_idx" ON "redirects_rels" USING btree ("project_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_category_id_idx" ON "redirects_rels" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_term_id_idx" ON "redirects_rels" USING btree ("term_id");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_redirects_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_redirects_id_idx";
  ALTER TABLE "page" DROP COLUMN IF EXISTS "meta_canonical_u_r_l";
  ALTER TABLE "page" DROP COLUMN IF EXISTS "meta_no_index";
  ALTER TABLE "_page_v" DROP COLUMN IF EXISTS "version_meta_canonical_u_r_l";
  ALTER TABLE "_page_v" DROP COLUMN IF EXISTS "version_meta_no_index";
  ALTER TABLE "post" DROP COLUMN IF EXISTS "meta_canonical_u_r_l";
  ALTER TABLE "post" DROP COLUMN IF EXISTS "meta_no_index";
  ALTER TABLE "_post_v" DROP COLUMN IF EXISTS "version_meta_canonical_u_r_l";
  ALTER TABLE "_post_v" DROP COLUMN IF EXISTS "version_meta_no_index";
  ALTER TABLE "project" DROP COLUMN IF EXISTS "meta_canonical_u_r_l";
  ALTER TABLE "project" DROP COLUMN IF EXISTS "meta_no_index";
  ALTER TABLE "_project_v" DROP COLUMN IF EXISTS "version_meta_canonical_u_r_l";
  ALTER TABLE "_project_v" DROP COLUMN IF EXISTS "version_meta_no_index";
  ALTER TABLE "term" DROP COLUMN IF EXISTS "meta_canonical_u_r_l";
  ALTER TABLE "term" DROP COLUMN IF EXISTS "meta_no_index";
  ALTER TABLE "_term_v" DROP COLUMN IF EXISTS "version_meta_canonical_u_r_l";
  ALTER TABLE "_term_v" DROP COLUMN IF EXISTS "version_meta_no_index";
  ALTER TABLE "service" DROP COLUMN IF EXISTS "meta_canonical_u_r_l";
  ALTER TABLE "service" DROP COLUMN IF EXISTS "meta_no_index";
  ALTER TABLE "_service_v" DROP COLUMN IF EXISTS "version_meta_canonical_u_r_l";
  ALTER TABLE "_service_v" DROP COLUMN IF EXISTS "version_meta_no_index";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "redirects_id";`)
}
