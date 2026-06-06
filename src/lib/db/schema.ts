import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users (synced with Clerk)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionId: text("subscription_id"),
  subscriptionStatus: text("subscription_status", {
    enum: ["active", "canceled", "past_due", "trialing", "incomplete", "incomplete_expired"],
  }),
  planTier: text("plan_tier", { enum: ["starter", "pro", "free"] }).default("free"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Proposal Templates
export const templates = sqliteTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: text("category", { enum: ["modern", "professional", "creative"] }).notNull(),
  thumbnailUrl: text("thumbnail_url"),
  htmlContent: text("html_content"), // The template HTML with placeholders
  isPremium: integer("is_premium", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Proposals
export const proposals = sqliteTable("proposals", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  templateId: text("template_id").references(() => templates.id),
  title: text("title").notNull(),
  clientName: text("client_name"),
  clientEmail: text("client_email"),
  clientCompany: text("client_company"),
  status: text("status", {
    enum: ["draft", "sent", "viewed", "accepted", "declined"],
  }).default("draft"),
  content: text("content"), // JSON string of proposal sections
  aiGenerated: integer("ai_generated", { mode: "boolean" }).default(false),
  totalAmount: real("total_amount"),
  currency: text("currency").default("USD"),
  shareToken: text("share_token").unique(),
  viewedAt: integer("viewed_at", { mode: "timestamp" }),
  sentAt: integer("sent_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Proposal Sections (the building blocks of a proposal)
export const proposalSections = sqliteTable("proposal_sections", {
  id: text("id").primaryKey(),
  proposalId: text("proposal_id")
    .notNull()
    .references(() => proposals.id),
  type: text("type", {
    enum: ["cover", "intro", "problem", "solution", "scope", "timeline", "pricing", "testimonial", "about", "cta"],
  }).notNull(),
  title: text("title").notNull(),
  content: text("content"), // Markdown or HTML content
  sortOrder: integer("sort_order").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Subscriptions (Stripe)
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(), // Stripe subscription ID
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  status: text("status", {
    enum: ["active", "canceled", "past_due", "trialing", "incomplete", "incomplete_expired"],
  }).notNull(),
  planTier: text("plan_tier", { enum: ["starter", "pro"] }).notNull(),
  currentPeriodStart: integer("current_period_start", { mode: "timestamp" }),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Waitlist (for pre-launch signups)
export const waitlist = sqliteTable("waitlist", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});