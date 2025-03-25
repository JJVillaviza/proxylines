import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { branchTable } from "./branch";

export const companyTable = pgTable("companies", {
  id: uuid().primaryKey(),
  businessName: text().notNull(),
  brandName: text().notNull(),
  description: text(),
  vision: text(),
  mission: text(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const companyRelation = relations(companyTable, ({ many }) => ({
  branch: many(branchTable),
}));
