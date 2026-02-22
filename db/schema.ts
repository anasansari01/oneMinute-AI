import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  organization_id: text("organization_id").notNull(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  created_at: text("created_at").default(sql`now()`),
})

export const metadata = pgTable("metadata", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  user_email: text("user_email").notNull(), 
  business_name: text("business_name").notNull(),
  website_url: text("website_url").notNull(),
  external_links: text("external_links"),
  created_at: text("created_at").default(sql`now()`),
})