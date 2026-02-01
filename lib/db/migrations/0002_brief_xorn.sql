ALTER TABLE "victims" ADD COLUMN "city_en" text;--> statement-breakpoint
CREATE INDEX "idx_victims_city_en" ON "victims" USING btree ("city_en");