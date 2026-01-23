import { pgTable, text, integer, date, timestamp, uuid, index, uniqueIndex } from "drizzle-orm/pg-core";

export const victims = pgTable(
  "victims",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullNameFa: text("full_name_fa"),
    fullNameEn: text("full_name_en"),
    age: integer("age"),
    gender: text("gender", { enum: ["male", "female", "child", "unknown"] }).notNull(),
    city: text("city").notNull(),
    dateOfDeath: date("date_of_death").notNull(),
    photoUrl: text("photo_url"),
    notesFa: text("notes_fa"),
    notesEn: text("notes_en"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    cityIdx: index("idx_victims_city").on(table.city),
    genderIdx: index("idx_victims_gender").on(table.gender),
    dateOfDeathIdx: index("idx_victims_date_of_death").on(table.dateOfDeath),
    createdAtIdx: index("idx_victims_created_at").on(table.createdAt),
  })
);

export const news = pgTable(
  "news",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    titleFa: text("title_fa"),
    titleEn: text("title_en"),
    publicationDate: date("publication_date").notNull(),
    country: text("country").notNull(),
    excerptSeparatorPosition: integer("excerpt_separator_position"),
    contentFa: text("content_fa"),
    contentEn: text("content_en"),
    imageUrl: text("image_url"),
    videoUrl: text("video_url"),
    audioUrl: text("audio_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("idx_news_slug").on(table.slug),
    publicationDateIdx: index("idx_news_publication_date").on(table.publicationDate),
    countryIdx: index("idx_news_country").on(table.country),
    createdAtIdx: index("idx_news_created_at").on(table.createdAt),
  })
);

export const newsCities = pgTable(
  "news_cities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    newsId: uuid("news_id")
      .notNull()
      .references(() => news.id, { onDelete: "cascade" }),
    city: text("city").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    newsIdIdx: index("idx_news_cities_news_id").on(table.newsId),
    cityIdx: index("idx_news_cities_city").on(table.city),
    uniqueNewsCity: uniqueIndex("idx_news_cities_unique").on(table.newsId, table.city),
  })
);

export const statements = pgTable(
  "statements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    titleFa: text("title_fa"),
    titleEn: text("title_en"),
    publicationDate: date("publication_date").notNull(),
    contentFa: text("content_fa"),
    contentEn: text("content_en"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("idx_statements_slug").on(table.slug),
    publicationDateIdx: index("idx_statements_publication_date").on(table.publicationDate),
    createdAtIdx: index("idx_statements_created_at").on(table.createdAt),
  })
);

export const media = pgTable(
  "media",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mediaType: text("media_type", { enum: ["photo", "video"] }).notNull(),
    country: text("country").notNull(),
    city: text("city").notNull(),
    district: text("district"),
    eventDate: date("event_date"),
    descriptionFa: text("description_fa"),
    descriptionEn: text("description_en"),
    fileUrl: text("file_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    mediaTypeIdx: index("idx_media_type").on(table.mediaType),
    countryIdx: index("idx_media_country").on(table.country),
    cityIdx: index("idx_media_city").on(table.city),
    eventDateIdx: index("idx_media_event_date").on(table.eventDate),
    createdAtIdx: index("idx_media_created_at").on(table.createdAt),
  })
);

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
