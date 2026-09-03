import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "site_telegram_label" varchar DEFAULT 'Telegram' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "site_email_label" varchar DEFAULT 'Email' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "site_back_to_top_label" varchar DEFAULT '↑ наверх' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "hero_title_dot" varchar DEFAULT '.' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "portfolio_projects_count_suffix" varchar DEFAULT 'проектов' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "portfolio_directions_count_suffix" varchar DEFAULT 'направлений' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "portfolio_approach_label" varchar DEFAULT 'один подход' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "preview_browser_label" varchar DEFAULT 'portfolio / preview' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "preview_frame_title" varchar DEFAULT 'Предпросмотр проекта' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "site_telegram_label";
  ALTER TABLE "site_settings" DROP COLUMN "site_email_label";
  ALTER TABLE "site_settings" DROP COLUMN "site_back_to_top_label";
  ALTER TABLE "site_settings" DROP COLUMN "hero_title_dot";
  ALTER TABLE "site_settings" DROP COLUMN "portfolio_projects_count_suffix";
  ALTER TABLE "site_settings" DROP COLUMN "portfolio_directions_count_suffix";
  ALTER TABLE "site_settings" DROP COLUMN "portfolio_approach_label";
  ALTER TABLE "site_settings" DROP COLUMN "preview_browser_label";
  ALTER TABLE "site_settings" DROP COLUMN "preview_frame_title";`)
}
