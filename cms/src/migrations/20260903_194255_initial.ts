import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_category" AS ENUM('business', 'services', 'lifestyle', 'concept');
  CREATE TYPE "public"."enum_projects_visual_mode" AS ENUM('image', 'orb');
  CREATE TYPE "public"."enum_projects_card_variant" AS ENUM('default', 'wide');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_preview_url" varchar,
  	"sizes_preview_width" numeric,
  	"sizes_preview_height" numeric,
  	"sizes_preview_mime_type" varchar,
  	"sizes_preview_filesize" numeric,
  	"sizes_preview_filename" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "enum_projects_category" NOT NULL,
  	"kind" varchar NOT NULL,
  	"tags" varchar,
  	"cover_id" integer,
  	"cover_class_name" varchar,
  	"fallback_cover" varchar,
  	"visual_mode" "enum_projects_visual_mode" DEFAULT 'image' NOT NULL,
  	"orb_label" varchar,
  	"overlay_line_one" varchar,
  	"overlay_line_two" varchar,
  	"alt" varchar,
  	"preview_url" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0 NOT NULL,
  	"card_variant" "enum_projects_card_variant" DEFAULT 'default' NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_hero_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_services_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_contact_type_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_title" varchar NOT NULL,
  	"site_description" varchar NOT NULL,
  	"site_brand_name" varchar NOT NULL,
  	"site_brand_tagline" varchar NOT NULL,
  	"site_brand_aria_label" varchar NOT NULL,
  	"site_nav_projects" varchar NOT NULL,
  	"site_nav_services" varchar NOT NULL,
  	"site_nav_process" varchar NOT NULL,
  	"site_nav_contact" varchar NOT NULL,
  	"site_header_cta" varchar NOT NULL,
  	"site_location" varchar NOT NULL,
  	"site_telegram_url" varchar,
  	"site_email_url" varchar,
  	"hero_year" varchar NOT NULL,
  	"hero_status" varchar NOT NULL,
  	"hero_eyebrow" varchar NOT NULL,
  	"hero_title_line_one" varchar NOT NULL,
  	"hero_title_emphasis" varchar NOT NULL,
  	"hero_title_line_two" varchar NOT NULL,
  	"hero_lead" varchar NOT NULL,
  	"hero_primary_cta" varchar NOT NULL,
  	"hero_secondary_cta" varchar NOT NULL,
  	"hero_portrait_id" integer,
  	"hero_portrait_fallback" varchar,
  	"hero_portrait_alt" varchar NOT NULL,
  	"hero_portrait_caption_label" varchar NOT NULL,
  	"hero_portrait_caption_line_one" varchar NOT NULL,
  	"hero_portrait_caption_line_two" varchar NOT NULL,
  	"hero_badge_one" varchar NOT NULL,
  	"hero_badge_two" varchar NOT NULL,
  	"hero_badge_three" varchar NOT NULL,
  	"hero_coordinate" varchar NOT NULL,
  	"hero_index" varchar NOT NULL,
  	"hero_scroll_label" varchar NOT NULL,
  	"portfolio_section_label" varchar NOT NULL,
  	"portfolio_heading_line_one" varchar NOT NULL,
  	"portfolio_heading_emphasis" varchar NOT NULL,
  	"portfolio_side_copy" varchar NOT NULL,
  	"portfolio_live_label" varchar NOT NULL,
  	"portfolio_empty_text" varchar NOT NULL,
  	"portfolio_footer_link" varchar NOT NULL,
  	"filters_all" varchar NOT NULL,
  	"filters_business" varchar NOT NULL,
  	"filters_services" varchar NOT NULL,
  	"filters_lifestyle" varchar NOT NULL,
  	"filters_concept" varchar NOT NULL,
  	"services_section_label" varchar NOT NULL,
  	"services_heading_line_one" varchar NOT NULL,
  	"services_heading_emphasis" varchar NOT NULL,
  	"services_lead" varchar NOT NULL,
  	"services_note" varchar NOT NULL,
  	"process_section_label" varchar NOT NULL,
  	"process_heading_line_one" varchar NOT NULL,
  	"process_heading_emphasis" varchar NOT NULL,
  	"process_lead" varchar NOT NULL,
  	"process_photo_id" integer,
  	"process_photo_fallback" varchar,
  	"process_photo_alt" varchar NOT NULL,
  	"process_stamp_line_one" varchar NOT NULL,
  	"process_stamp_emphasis" varchar NOT NULL,
  	"process_stamp_line_two" varchar NOT NULL,
  	"process_photo_index" varchar NOT NULL,
  	"process_kicker" varchar NOT NULL,
  	"process_title_line_one" varchar NOT NULL,
  	"process_title_emphasis" varchar NOT NULL,
  	"process_copy" varchar NOT NULL,
  	"contact_section_label" varchar NOT NULL,
  	"contact_heading_line_one" varchar NOT NULL,
  	"contact_heading_line_two" varchar NOT NULL,
  	"contact_heading_emphasis" varchar NOT NULL,
  	"contact_lead" varchar NOT NULL,
  	"contact_response_label" varchar NOT NULL,
  	"contact_name_label" varchar NOT NULL,
  	"contact_name_placeholder" varchar NOT NULL,
  	"contact_contact_label" varchar NOT NULL,
  	"contact_contact_placeholder" varchar NOT NULL,
  	"contact_type_label" varchar NOT NULL,
  	"contact_message_label" varchar NOT NULL,
  	"contact_message_placeholder" varchar NOT NULL,
  	"contact_submit_label" varchar NOT NULL,
  	"contact_status_text" varchar NOT NULL,
  	"preview_default_kind" varchar NOT NULL,
  	"preview_default_title" varchar NOT NULL,
  	"preview_default_tags" varchar NOT NULL,
  	"preview_loader_text" varchar NOT NULL,
  	"preview_external_label" varchar NOT NULL,
  	"preview_hint" varchar NOT NULL,
  	"preview_close_label" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_hero_metrics" ADD CONSTRAINT "site_settings_hero_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_marquee_items" ADD CONSTRAINT "site_settings_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_services_tags" ADD CONSTRAINT "site_settings_services_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_services_items" ADD CONSTRAINT "site_settings_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_process_steps" ADD CONSTRAINT "site_settings_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_contact_type_options" ADD CONSTRAINT "site_settings_contact_type_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_portrait_id_media_id_fk" FOREIGN KEY ("hero_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_process_photo_id_media_id_fk" FOREIGN KEY ("process_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_preview_sizes_preview_filename_idx" ON "media" USING btree ("sizes_preview_filename");
  CREATE INDEX "projects__order_idx" ON "projects" USING btree ("_order");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_hero_metrics_order_idx" ON "site_settings_hero_metrics" USING btree ("_order");
  CREATE INDEX "site_settings_hero_metrics_parent_id_idx" ON "site_settings_hero_metrics" USING btree ("_parent_id");
  CREATE INDEX "site_settings_marquee_items_order_idx" ON "site_settings_marquee_items" USING btree ("_order");
  CREATE INDEX "site_settings_marquee_items_parent_id_idx" ON "site_settings_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "site_settings_services_tags_order_idx" ON "site_settings_services_tags" USING btree ("_order");
  CREATE INDEX "site_settings_services_tags_parent_id_idx" ON "site_settings_services_tags" USING btree ("_parent_id");
  CREATE INDEX "site_settings_services_items_order_idx" ON "site_settings_services_items" USING btree ("_order");
  CREATE INDEX "site_settings_services_items_parent_id_idx" ON "site_settings_services_items" USING btree ("_parent_id");
  CREATE INDEX "site_settings_process_steps_order_idx" ON "site_settings_process_steps" USING btree ("_order");
  CREATE INDEX "site_settings_process_steps_parent_id_idx" ON "site_settings_process_steps" USING btree ("_parent_id");
  CREATE INDEX "site_settings_contact_type_options_order_idx" ON "site_settings_contact_type_options" USING btree ("_order");
  CREATE INDEX "site_settings_contact_type_options_parent_id_idx" ON "site_settings_contact_type_options" USING btree ("_parent_id");
  CREATE INDEX "site_settings_hero_hero_portrait_idx" ON "site_settings" USING btree ("hero_portrait_id");
  CREATE INDEX "site_settings_process_process_photo_idx" ON "site_settings" USING btree ("process_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_hero_metrics" CASCADE;
  DROP TABLE "site_settings_marquee_items" CASCADE;
  DROP TABLE "site_settings_services_tags" CASCADE;
  DROP TABLE "site_settings_services_items" CASCADE;
  DROP TABLE "site_settings_process_steps" CASCADE;
  DROP TABLE "site_settings_contact_type_options" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_projects_category";
  DROP TYPE "public"."enum_projects_visual_mode";
  DROP TYPE "public"."enum_projects_card_variant";`)
}
