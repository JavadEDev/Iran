ALTER TABLE "victims" ADD COLUMN "city_en" text;
CREATE INDEX "idx_victims_city_en" ON "victims" ("city_en");
