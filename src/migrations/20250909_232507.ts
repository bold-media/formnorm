import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "settings_calculator_instructions_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  ALTER TABLE "form_submissions" ADD COLUMN "calculator_result_id" uuid;
  ALTER TABLE "settings" ADD COLUMN "calculator_interface_texts_additional_elements_title" varchar DEFAULT 'Дополнительные элементы';
  ALTER TABLE "settings" ADD COLUMN "calculator_result_page_settings_result_form_id" uuid;
  ALTER TABLE "settings" ADD COLUMN "calculator_result_page_settings_form_show_button_text" varchar;
  ALTER TABLE "settings" ADD COLUMN "calculator_result_page_settings_form_hide_button_text" varchar;
  ALTER TABLE "settings" ADD COLUMN "calculator_result_page_settings_download_pdf_button_text" varchar;
  ALTER TABLE "settings" ADD COLUMN "calculator_result_page_settings_download_pdf_button_loading" varchar;
  ALTER TABLE "settings" ADD COLUMN "calculator_result_page_settings_share_button_text" varchar;
  ALTER TABLE "settings" ADD COLUMN "calculator_instructions_title" varchar;
  ALTER TABLE "settings_calculator_instructions_steps" ADD CONSTRAINT "settings_calculator_instructions_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "settings_calculator_instructions_steps_order_idx" ON "settings_calculator_instructions_steps" USING btree ("_order");
  CREATE INDEX "settings_calculator_instructions_steps_parent_id_idx" ON "settings_calculator_instructions_steps" USING btree ("_parent_id");
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_calculator_result_id_calculator_results_id_fk" FOREIGN KEY ("calculator_result_id") REFERENCES "public"."calculator_results"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_calculator_result_page_settings_result_form_id_forms_id_fk" FOREIGN KEY ("calculator_result_page_settings_result_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "form_submissions_calculator_result_idx" ON "form_submissions" USING btree ("calculator_result_id");
  CREATE INDEX "settings_calculator_result_page_settings_calculator_resu_idx" ON "settings" USING btree ("calculator_result_page_settings_result_form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_calculator_instructions_steps" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "settings_calculator_instructions_steps" CASCADE;
  ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_calculator_result_id_calculator_results_id_fk";
  
  ALTER TABLE "settings" DROP CONSTRAINT "settings_calculator_result_page_settings_result_form_id_forms_id_fk";
  
  DROP INDEX "form_submissions_calculator_result_idx";
  DROP INDEX "settings_calculator_result_page_settings_calculator_resu_idx";
  ALTER TABLE "form_submissions" DROP COLUMN "calculator_result_id";
  ALTER TABLE "settings" DROP COLUMN "calculator_interface_texts_additional_elements_title";
  ALTER TABLE "settings" DROP COLUMN "calculator_result_page_settings_result_form_id";
  ALTER TABLE "settings" DROP COLUMN "calculator_result_page_settings_form_show_button_text";
  ALTER TABLE "settings" DROP COLUMN "calculator_result_page_settings_form_hide_button_text";
  ALTER TABLE "settings" DROP COLUMN "calculator_result_page_settings_download_pdf_button_text";
  ALTER TABLE "settings" DROP COLUMN "calculator_result_page_settings_download_pdf_button_loading";
  ALTER TABLE "settings" DROP COLUMN "calculator_result_page_settings_share_button_text";
  ALTER TABLE "settings" DROP COLUMN "calculator_instructions_title";`)
}
