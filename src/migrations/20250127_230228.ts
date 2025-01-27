import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "post" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"author_id" uuid,
  	"title" varchar,
  	"cover_id" uuid,
  	"excerpt" varchar,
  	"article" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" varchar DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "post_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"category_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "_post_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_author_id" uuid,
  	"version_title" varchar,
  	"version_cover_id" uuid,
  	"version_excerpt" varchar,
  	"version_article" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" uuid,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" varchar DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_post_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"category_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "category" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "project" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"suffix" varchar,
  	"cover_id" uuid,
  	"description_title" varchar,
  	"description_subtitle" varchar,
  	"description_text" varchar,
  	"description_plan_one_id" uuid,
  	"description_plan_two_id" uuid,
  	"excerpt" varchar,
  	"article" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" varchar DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_project_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_suffix" varchar,
  	"version_cover_id" uuid,
  	"version_description_title" varchar,
  	"version_description_subtitle" varchar,
  	"version_description_text" varchar,
  	"version_description_plan_one_id" uuid,
  	"version_description_plan_two_id" uuid,
  	"version_excerpt" varchar,
  	"version_article" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" uuid,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" varchar DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "term" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"suffix" varchar,
  	"cover_id" uuid,
  	"excerpt" varchar,
  	"article" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" varchar DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_term_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_suffix" varchar,
  	"version_cover_id" uuid,
  	"version_excerpt" varchar,
  	"version_article" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" uuid,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" varchar DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "service" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"suffix" varchar,
  	"cover_id" uuid,
  	"excerpt" varchar,
  	"article" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" varchar DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_service_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_suffix" varchar,
  	"version_cover_id" uuid,
  	"version_excerpt" varchar,
  	"version_article" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" uuid,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" varchar DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_radio_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_radio" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"placeholder" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  ALTER TABLE "page" ADD COLUMN "enable_breadcrumbs" boolean DEFAULT true;
  ALTER TABLE "_page_v" ADD COLUMN "version_enable_breadcrumbs" boolean DEFAULT true;
  ALTER TABLE "user" ADD COLUMN "name" varchar;
  ALTER TABLE "user" ADD COLUMN "job" varchar;
  ALTER TABLE "user" ADD COLUMN "picture_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "post_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "category_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "project_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "term_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "service_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "post" ADD CONSTRAINT "post_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "post" ADD CONSTRAINT "post_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "post" ADD CONSTRAINT "post_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "post_rels" ADD CONSTRAINT "post_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "post_rels" ADD CONSTRAINT "post_rels_category_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_post_v" ADD CONSTRAINT "_post_v_parent_id_post_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."post"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_post_v" ADD CONSTRAINT "_post_v_version_author_id_user_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_post_v" ADD CONSTRAINT "_post_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_post_v" ADD CONSTRAINT "_post_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_post_v_rels" ADD CONSTRAINT "_post_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_post_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_post_v_rels" ADD CONSTRAINT "_post_v_rels_category_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "project" ADD CONSTRAINT "project_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "project" ADD CONSTRAINT "project_description_plan_one_id_media_id_fk" FOREIGN KEY ("description_plan_one_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "project" ADD CONSTRAINT "project_description_plan_two_id_media_id_fk" FOREIGN KEY ("description_plan_two_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "project" ADD CONSTRAINT "project_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_project_v" ADD CONSTRAINT "_project_v_parent_id_project_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."project"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_project_v" ADD CONSTRAINT "_project_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_project_v" ADD CONSTRAINT "_project_v_version_description_plan_one_id_media_id_fk" FOREIGN KEY ("version_description_plan_one_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_project_v" ADD CONSTRAINT "_project_v_version_description_plan_two_id_media_id_fk" FOREIGN KEY ("version_description_plan_two_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_project_v" ADD CONSTRAINT "_project_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "term" ADD CONSTRAINT "term_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "term" ADD CONSTRAINT "term_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_term_v" ADD CONSTRAINT "_term_v_parent_id_term_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."term"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_term_v" ADD CONSTRAINT "_term_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_term_v" ADD CONSTRAINT "_term_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service" ADD CONSTRAINT "service_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service" ADD CONSTRAINT "service_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_service_v" ADD CONSTRAINT "_service_v_parent_id_service_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_service_v" ADD CONSTRAINT "_service_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_service_v" ADD CONSTRAINT "_service_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_radio_options" ADD CONSTRAINT "forms_blocks_radio_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_radio"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_radio" ADD CONSTRAINT "forms_blocks_radio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "post_slug_idx" ON "post" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "post_author_idx" ON "post" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "post_cover_idx" ON "post" USING btree ("cover_id");
  CREATE INDEX IF NOT EXISTS "post_meta_meta_image_idx" ON "post" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "post_updated_at_idx" ON "post" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "post_created_at_idx" ON "post" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "post__status_idx" ON "post" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "post_rels_order_idx" ON "post_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "post_rels_parent_idx" ON "post_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "post_rels_path_idx" ON "post_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "post_rels_category_id_idx" ON "post_rels" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "_post_v_parent_idx" ON "_post_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_post_v_version_version_slug_idx" ON "_post_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_post_v_version_version_author_idx" ON "_post_v" USING btree ("version_author_id");
  CREATE INDEX IF NOT EXISTS "_post_v_version_version_cover_idx" ON "_post_v" USING btree ("version_cover_id");
  CREATE INDEX IF NOT EXISTS "_post_v_version_meta_version_meta_image_idx" ON "_post_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_post_v_version_version_updated_at_idx" ON "_post_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_post_v_version_version_created_at_idx" ON "_post_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_post_v_version_version__status_idx" ON "_post_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_post_v_created_at_idx" ON "_post_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_post_v_updated_at_idx" ON "_post_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_post_v_latest_idx" ON "_post_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_post_v_autosave_idx" ON "_post_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_post_v_rels_order_idx" ON "_post_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_post_v_rels_parent_idx" ON "_post_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_post_v_rels_path_idx" ON "_post_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_post_v_rels_category_id_idx" ON "_post_v_rels" USING btree ("category_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "category_slug_idx" ON "category" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "category_updated_at_idx" ON "category" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "category_created_at_idx" ON "category" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "project_slug_idx" ON "project" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "project_cover_idx" ON "project" USING btree ("cover_id");
  CREATE INDEX IF NOT EXISTS "project_description_description_plan_one_idx" ON "project" USING btree ("description_plan_one_id");
  CREATE INDEX IF NOT EXISTS "project_description_description_plan_two_idx" ON "project" USING btree ("description_plan_two_id");
  CREATE INDEX IF NOT EXISTS "project_meta_meta_image_idx" ON "project" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "project_updated_at_idx" ON "project" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "project_created_at_idx" ON "project" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "project__status_idx" ON "project" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_project_v_parent_idx" ON "_project_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_project_v_version_version_slug_idx" ON "_project_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_project_v_version_version_cover_idx" ON "_project_v" USING btree ("version_cover_id");
  CREATE INDEX IF NOT EXISTS "_project_v_version_description_version_description_plan_one_idx" ON "_project_v" USING btree ("version_description_plan_one_id");
  CREATE INDEX IF NOT EXISTS "_project_v_version_description_version_description_plan_two_idx" ON "_project_v" USING btree ("version_description_plan_two_id");
  CREATE INDEX IF NOT EXISTS "_project_v_version_meta_version_meta_image_idx" ON "_project_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_project_v_version_version_updated_at_idx" ON "_project_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_project_v_version_version_created_at_idx" ON "_project_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_project_v_version_version__status_idx" ON "_project_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_project_v_created_at_idx" ON "_project_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_project_v_updated_at_idx" ON "_project_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_project_v_latest_idx" ON "_project_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_project_v_autosave_idx" ON "_project_v" USING btree ("autosave");
  CREATE UNIQUE INDEX IF NOT EXISTS "term_slug_idx" ON "term" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "term_cover_idx" ON "term" USING btree ("cover_id");
  CREATE INDEX IF NOT EXISTS "term_meta_meta_image_idx" ON "term" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "term_updated_at_idx" ON "term" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "term_created_at_idx" ON "term" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "term__status_idx" ON "term" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_term_v_parent_idx" ON "_term_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_term_v_version_version_slug_idx" ON "_term_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_term_v_version_version_cover_idx" ON "_term_v" USING btree ("version_cover_id");
  CREATE INDEX IF NOT EXISTS "_term_v_version_meta_version_meta_image_idx" ON "_term_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_term_v_version_version_updated_at_idx" ON "_term_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_term_v_version_version_created_at_idx" ON "_term_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_term_v_version_version__status_idx" ON "_term_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_term_v_created_at_idx" ON "_term_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_term_v_updated_at_idx" ON "_term_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_term_v_latest_idx" ON "_term_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_term_v_autosave_idx" ON "_term_v" USING btree ("autosave");
  CREATE UNIQUE INDEX IF NOT EXISTS "service_slug_idx" ON "service" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "service_cover_idx" ON "service" USING btree ("cover_id");
  CREATE INDEX IF NOT EXISTS "service_meta_meta_image_idx" ON "service" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "service_updated_at_idx" ON "service" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "service_created_at_idx" ON "service" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "service__status_idx" ON "service" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_service_v_parent_idx" ON "_service_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_service_v_version_version_slug_idx" ON "_service_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_service_v_version_version_cover_idx" ON "_service_v" USING btree ("version_cover_id");
  CREATE INDEX IF NOT EXISTS "_service_v_version_meta_version_meta_image_idx" ON "_service_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_service_v_version_version_updated_at_idx" ON "_service_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_service_v_version_version_created_at_idx" ON "_service_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_service_v_version_version__status_idx" ON "_service_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_service_v_created_at_idx" ON "_service_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_service_v_updated_at_idx" ON "_service_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_service_v_latest_idx" ON "_service_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_service_v_autosave_idx" ON "_service_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "forms_blocks_radio_options_order_idx" ON "forms_blocks_radio_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_radio_options_parent_id_idx" ON "forms_blocks_radio_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_radio_order_idx" ON "forms_blocks_radio" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_radio_parent_id_idx" ON "forms_blocks_radio" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_radio_path_idx" ON "forms_blocks_radio" USING btree ("_path");
  DO $$ BEGIN
   ALTER TABLE "user" ADD CONSTRAINT "user_picture_id_media_id_fk" FOREIGN KEY ("picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_category_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_term_fk" FOREIGN KEY ("term_id") REFERENCES "public"."term"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "user_picture_idx" ON "user" USING btree ("picture_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_post_id_idx" ON "payload_locked_documents_rels" USING btree ("post_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_category_id_idx" ON "payload_locked_documents_rels" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_project_id_idx" ON "payload_locked_documents_rels" USING btree ("project_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_term_id_idx" ON "payload_locked_documents_rels" USING btree ("term_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_service_id_idx" ON "payload_locked_documents_rels" USING btree ("service_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "post" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_post_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_post_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "category" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_project_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "term" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_term_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "post" CASCADE;
  DROP TABLE "post_rels" CASCADE;
  DROP TABLE "_post_v" CASCADE;
  DROP TABLE "_post_v_rels" CASCADE;
  DROP TABLE "category" CASCADE;
  DROP TABLE "project" CASCADE;
  DROP TABLE "_project_v" CASCADE;
  DROP TABLE "term" CASCADE;
  DROP TABLE "_term_v" CASCADE;
  DROP TABLE "service" CASCADE;
  DROP TABLE "_service_v" CASCADE;
  DROP TABLE "forms_blocks_radio_options" CASCADE;
  DROP TABLE "forms_blocks_radio" CASCADE;
  ALTER TABLE "user" DROP CONSTRAINT "user_picture_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_post_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_category_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_project_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_term_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_service_fk";
  
  DROP INDEX IF EXISTS "user_picture_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_post_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_category_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_project_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_term_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_service_id_idx";
  ALTER TABLE "page" DROP COLUMN IF EXISTS "enable_breadcrumbs";
  ALTER TABLE "_page_v" DROP COLUMN IF EXISTS "version_enable_breadcrumbs";
  ALTER TABLE "user" DROP COLUMN IF EXISTS "name";
  ALTER TABLE "user" DROP COLUMN IF EXISTS "job";
  ALTER TABLE "user" DROP COLUMN IF EXISTS "picture_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "post_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "category_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "project_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "term_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "service_id";`)
}
