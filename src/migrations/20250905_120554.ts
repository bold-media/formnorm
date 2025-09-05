import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "user_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "settings_calculator_area_settings_area_coefficients" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"min_area" numeric NOT NULL,
  	"max_area" numeric,
  	"coefficient" numeric NOT NULL
  );
  
  CREATE TABLE "settings_calculator_floor_settings_floor_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"coefficient" numeric NOT NULL,
  	"is_default" boolean
  );
  
  CREATE TABLE "settings_calculator_services_sections_services_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price_per_m2" numeric,
  	"description" varchar
  );
  
  CREATE TABLE "settings_calculator_services_sections_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"field_type" varchar DEFAULT 'checkbox',
  	"price_per_m2" numeric,
  	"fixed_price" numeric,
  	"ignore_area" boolean,
  	"is_required" boolean,
  	"is_default" boolean,
  	"radio_group" varchar,
  	"has_options" boolean
  );
  
  CREATE TABLE "settings_calculator_services_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "settings_calculator_additional_sections_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"is_default" boolean
  );
  
  CREATE TABLE "settings_calculator_additional_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"field_type" varchar DEFAULT 'checkbox'
  );
  
  ALTER TABLE "settings" RENAME COLUMN "seo_title" TO "seo_default_title";
  ALTER TABLE "settings" RENAME COLUMN "seo_description" TO "seo_default_description";
  DROP INDEX "_project_v_version_description_version_description_plan_one_idx";
  DROP INDEX "_project_v_version_description_version_description_plan_two_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "project" ADD COLUMN "_order" varchar;
  ALTER TABLE "_project_v" ADD COLUMN "version__order" varchar;
  ALTER TABLE "settings" ADD COLUMN "seo_default_image_id" uuid;
  ALTER TABLE "settings" ADD COLUMN "seo_default_canonical_u_r_l" varchar;
  ALTER TABLE "settings" ADD COLUMN "seo_default_no_index" boolean DEFAULT false;
  ALTER TABLE "settings" ADD COLUMN "seo_blog_title" varchar;
  ALTER TABLE "settings" ADD COLUMN "seo_blog_description" varchar;
  ALTER TABLE "settings" ADD COLUMN "seo_blog_image_id" uuid;
  ALTER TABLE "settings" ADD COLUMN "seo_blog_canonical_u_r_l" varchar;
  ALTER TABLE "settings" ADD COLUMN "seo_blog_no_index" boolean DEFAULT false;
  ALTER TABLE "settings" ADD COLUMN "calculator_calculator_title" varchar DEFAULT 'Калькулятор проектирования дома' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "calculator_currency" varchar DEFAULT 'р.' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "calculator_area_settings_label" varchar DEFAULT 'Общая площадь дома (все помещения на всех этажах)';
  ALTER TABLE "settings" ADD COLUMN "calculator_area_settings_placeholder" varchar DEFAULT 'Введите площадь в м²';
  ALTER TABLE "settings" ADD COLUMN "calculator_area_settings_default_area" numeric DEFAULT 0;
  ALTER TABLE "settings" ADD COLUMN "calculator_floor_settings_label" varchar DEFAULT 'Этажность';
  ALTER TABLE "settings" ADD COLUMN "calculator_interface_texts_submit_button_text" varchar DEFAULT 'Рассчитать стоимость';
  ALTER TABLE "settings" ADD COLUMN "calculator_interface_texts_reset_button_text" varchar DEFAULT 'Сбросить';
  ALTER TABLE "settings" ADD COLUMN "calculator_interface_texts_total_price_label" varchar DEFAULT 'Стоимость всех разделов';
  ALTER TABLE "settings" ADD COLUMN "calculator_interface_texts_price_per_m2_label" varchar DEFAULT 'Цена всех разделов за м²';
  ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_calculator_area_settings_area_coefficients" ADD CONSTRAINT "settings_calculator_area_settings_area_coefficients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_calculator_floor_settings_floor_options" ADD CONSTRAINT "settings_calculator_floor_settings_floor_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_calculator_services_sections_services_options" ADD CONSTRAINT "settings_calculator_services_sections_services_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings_calculator_services_sections_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_calculator_services_sections_services" ADD CONSTRAINT "settings_calculator_services_sections_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings_calculator_services_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_calculator_services_sections" ADD CONSTRAINT "settings_calculator_services_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_calculator_additional_sections_elements" ADD CONSTRAINT "settings_calculator_additional_sections_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings_calculator_additional_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_calculator_additional_sections" ADD CONSTRAINT "settings_calculator_additional_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "user_sessions_order_idx" ON "user_sessions" USING btree ("_order");
  CREATE INDEX "user_sessions_parent_id_idx" ON "user_sessions" USING btree ("_parent_id");
  CREATE INDEX "settings_calculator_area_settings_area_coefficients_order_idx" ON "settings_calculator_area_settings_area_coefficients" USING btree ("_order");
  CREATE INDEX "settings_calculator_area_settings_area_coefficients_parent_id_idx" ON "settings_calculator_area_settings_area_coefficients" USING btree ("_parent_id");
  CREATE INDEX "settings_calculator_floor_settings_floor_options_order_idx" ON "settings_calculator_floor_settings_floor_options" USING btree ("_order");
  CREATE INDEX "settings_calculator_floor_settings_floor_options_parent_id_idx" ON "settings_calculator_floor_settings_floor_options" USING btree ("_parent_id");
  CREATE INDEX "settings_calculator_services_sections_services_options_order_idx" ON "settings_calculator_services_sections_services_options" USING btree ("_order");
  CREATE INDEX "settings_calculator_services_sections_services_options_parent_id_idx" ON "settings_calculator_services_sections_services_options" USING btree ("_parent_id");
  CREATE INDEX "settings_calculator_services_sections_services_order_idx" ON "settings_calculator_services_sections_services" USING btree ("_order");
  CREATE INDEX "settings_calculator_services_sections_services_parent_id_idx" ON "settings_calculator_services_sections_services" USING btree ("_parent_id");
  CREATE INDEX "settings_calculator_services_sections_order_idx" ON "settings_calculator_services_sections" USING btree ("_order");
  CREATE INDEX "settings_calculator_services_sections_parent_id_idx" ON "settings_calculator_services_sections" USING btree ("_parent_id");
  CREATE INDEX "settings_calculator_additional_sections_elements_order_idx" ON "settings_calculator_additional_sections_elements" USING btree ("_order");
  CREATE INDEX "settings_calculator_additional_sections_elements_parent_id_idx" ON "settings_calculator_additional_sections_elements" USING btree ("_parent_id");
  CREATE INDEX "settings_calculator_additional_sections_order_idx" ON "settings_calculator_additional_sections" USING btree ("_order");
  CREATE INDEX "settings_calculator_additional_sections_parent_id_idx" ON "settings_calculator_additional_sections" USING btree ("_parent_id");
  ALTER TABLE "settings" ADD CONSTRAINT "settings_seo_default_image_id_media_id_fk" FOREIGN KEY ("seo_default_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_seo_blog_image_id_media_id_fk" FOREIGN KEY ("seo_blog_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "project__order_idx" ON "project" USING btree ("_order");
  CREATE INDEX "_project_v_version_version__order_idx" ON "_project_v" USING btree ("version__order");
  CREATE INDEX "_project_v_version_description_version_description_plan__idx" ON "_project_v" USING btree ("version_description_plan_one_id");
  CREATE INDEX "_project_v_version_description_version_description_pla_1_idx" ON "_project_v" USING btree ("version_description_plan_two_id");
  CREATE INDEX "settings_seo_default_seo_default_image_idx" ON "settings" USING btree ("seo_default_image_id");
  CREATE INDEX "settings_seo_blog_seo_blog_image_idx" ON "settings" USING btree ("seo_blog_image_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "user_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_calculator_area_settings_area_coefficients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_calculator_floor_settings_floor_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_calculator_services_sections_services_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_calculator_services_sections_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_calculator_services_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_calculator_additional_sections_elements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_calculator_additional_sections" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "user_sessions" CASCADE;
  DROP TABLE "settings_calculator_area_settings_area_coefficients" CASCADE;
  DROP TABLE "settings_calculator_floor_settings_floor_options" CASCADE;
  DROP TABLE "settings_calculator_services_sections_services_options" CASCADE;
  DROP TABLE "settings_calculator_services_sections_services" CASCADE;
  DROP TABLE "settings_calculator_services_sections" CASCADE;
  DROP TABLE "settings_calculator_additional_sections_elements" CASCADE;
  DROP TABLE "settings_calculator_additional_sections" CASCADE;
  ALTER TABLE "settings" DROP CONSTRAINT "settings_seo_default_image_id_media_id_fk";
  
  ALTER TABLE "settings" DROP CONSTRAINT "settings_seo_blog_image_id_media_id_fk";
  
  DROP INDEX "project__order_idx";
  DROP INDEX "_project_v_version_version__order_idx";
  DROP INDEX "_project_v_version_description_version_description_plan__idx";
  DROP INDEX "_project_v_version_description_version_description_pla_1_idx";
  DROP INDEX "settings_seo_default_seo_default_image_idx";
  DROP INDEX "settings_seo_blog_seo_blog_image_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "settings" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "settings" ADD COLUMN "seo_description" varchar;
  CREATE INDEX "_project_v_version_description_version_description_plan_one_idx" ON "_project_v" USING btree ("version_description_plan_one_id");
  CREATE INDEX "_project_v_version_description_version_description_plan_two_idx" ON "_project_v" USING btree ("version_description_plan_two_id");
  CREATE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  ALTER TABLE "project" DROP COLUMN "_order";
  ALTER TABLE "_project_v" DROP COLUMN "version__order";
  ALTER TABLE "settings" DROP COLUMN "seo_default_title";
  ALTER TABLE "settings" DROP COLUMN "seo_default_description";
  ALTER TABLE "settings" DROP COLUMN "seo_default_image_id";
  ALTER TABLE "settings" DROP COLUMN "seo_default_canonical_u_r_l";
  ALTER TABLE "settings" DROP COLUMN "seo_default_no_index";
  ALTER TABLE "settings" DROP COLUMN "seo_blog_title";
  ALTER TABLE "settings" DROP COLUMN "seo_blog_description";
  ALTER TABLE "settings" DROP COLUMN "seo_blog_image_id";
  ALTER TABLE "settings" DROP COLUMN "seo_blog_canonical_u_r_l";
  ALTER TABLE "settings" DROP COLUMN "seo_blog_no_index";
  ALTER TABLE "settings" DROP COLUMN "calculator_calculator_title";
  ALTER TABLE "settings" DROP COLUMN "calculator_currency";
  ALTER TABLE "settings" DROP COLUMN "calculator_area_settings_label";
  ALTER TABLE "settings" DROP COLUMN "calculator_area_settings_placeholder";
  ALTER TABLE "settings" DROP COLUMN "calculator_area_settings_default_area";
  ALTER TABLE "settings" DROP COLUMN "calculator_floor_settings_label";
  ALTER TABLE "settings" DROP COLUMN "calculator_interface_texts_submit_button_text";
  ALTER TABLE "settings" DROP COLUMN "calculator_interface_texts_reset_button_text";
  ALTER TABLE "settings" DROP COLUMN "calculator_interface_texts_total_price_label";
  ALTER TABLE "settings" DROP COLUMN "calculator_interface_texts_price_per_m2_label";`)
}
