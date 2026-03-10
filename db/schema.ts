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

export const knowledge_source = pgTable("knowledge_source", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  user_email: text("user_email").notNull(), 
  type: text("type").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("active"),
  source_url: text("source_url"),
  content: text("content"),
  meta_data: text("meta_data"),
  last_updated: text("last_updated").default(sql`now()`),
  created_at: text("created_at").default(sql`now()`),
});

export const sections = pgTable("sections", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  user_email: text("user_email").notNull(), 
  name: text("name").notNull(),
  description: text("description").notNull(),
  source_ids: text("source_ids").array().notNull(),
  tone: text("tone").notNull(),
  allowed_topics: text("allowed_topics"),
  blocked_topics: text("blocked_topics"),
  status: text("status").notNull().default("active"),
  created_at: text("created_at").default(sql`now()`),
});

export const chatBotMetadata = pgTable("chatBotMetadata", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  user_email: text("user_email").notNull(), 
  color: text("color").default("#4f39f6"),
  welcome_message: text("welcome_message").default("Hi there, How can I help you today?"),
  created_at: text("created_at").default(sql`now()`),
});

export const teamMembers = pgTable("teamMembers", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  user_email: text("user_email").notNull(), 
  name: text("name").notNull(),
  organization_id: text("organization_id").notNull(),
  role: text("role").notNull().default("member"),
  status: text("status").notNull().default("pending"),
  created_at: text("created_at").default(sql`now()`),
});

export const conversation = pgTable("conversation", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  user_email: text("user_email"), 
  name: text("name"),
  visitor_ip: text("visitor_ip"),
  chatbot_id: text("chatbot_id").notNull(),
  created_at: text("created_at").default(sql`now()`),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  conversation_id: text("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  created_at: text("created_at").default(sql`now()`),
});

export const widgets = pgTable("widgets", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  organization_id: text("organization_id").notNull(),
  allowed_domains: text("allowed_domains").array(),
  status: text("status").notNull().default("active"),
  created_at: text("created_at").default(sql`now()`),
});