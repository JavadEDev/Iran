CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_type" text NOT NULL,
	"country" text NOT NULL,
	"city" text NOT NULL,
	"district" text,
	"event_date" date,
	"description_fa" text,
	"description_en" text,
	"file_url" text NOT NULL,
	"thumbnail_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title_fa" text,
	"title_en" text,
	"publication_date" date NOT NULL,
	"country" text NOT NULL,
	"excerpt_separator_position" integer,
	"content_fa" text,
	"content_en" text,
	"image_url" text,
	"video_url" text,
	"audio_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "news_cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"news_id" uuid NOT NULL,
	"city" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title_fa" text,
	"title_en" text,
	"publication_date" date NOT NULL,
	"content_fa" text,
	"content_en" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "statements_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "victims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name_fa" text,
	"full_name_en" text,
	"age" integer,
	"gender" text NOT NULL,
	"city" text NOT NULL,
	"date_of_death" date NOT NULL,
	"photo_url" text,
	"notes_fa" text,
	"notes_en" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "news_cities" ADD CONSTRAINT "news_cities_news_id_news_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_media_type" ON "media" USING btree ("media_type");--> statement-breakpoint
CREATE INDEX "idx_media_country" ON "media" USING btree ("country");--> statement-breakpoint
CREATE INDEX "idx_media_city" ON "media" USING btree ("city");--> statement-breakpoint
CREATE INDEX "idx_media_event_date" ON "media" USING btree ("event_date");--> statement-breakpoint
CREATE INDEX "idx_media_created_at" ON "media" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_news_slug" ON "news" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_news_publication_date" ON "news" USING btree ("publication_date");--> statement-breakpoint
CREATE INDEX "idx_news_country" ON "news" USING btree ("country");--> statement-breakpoint
CREATE INDEX "idx_news_created_at" ON "news" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_news_cities_news_id" ON "news_cities" USING btree ("news_id");--> statement-breakpoint
CREATE INDEX "idx_news_cities_city" ON "news_cities" USING btree ("city");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_news_cities_unique" ON "news_cities" USING btree ("news_id","city");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_statements_slug" ON "statements" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_statements_publication_date" ON "statements" USING btree ("publication_date");--> statement-breakpoint
CREATE INDEX "idx_statements_created_at" ON "statements" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_victims_city" ON "victims" USING btree ("city");--> statement-breakpoint
CREATE INDEX "idx_victims_gender" ON "victims" USING btree ("gender");--> statement-breakpoint
CREATE INDEX "idx_victims_date_of_death" ON "victims" USING btree ("date_of_death");--> statement-breakpoint
CREATE INDEX "idx_victims_created_at" ON "victims" USING btree ("created_at");