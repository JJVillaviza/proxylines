import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { accountTable } from "./account";
import { companyTable } from "./company";

export const branchEnum = pgEnum("types", ["main", "branch"]);

export const branchTable = pgTable("branches", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  role: branchEnum(),
  email: text().notNull(),
  company_id: uuid(),
  account_id: uuid().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const branchRelation = relations(branchTable, ({ one }) => ({
  account: one(accountTable, {
    fields: [branchTable.account_id],
    references: [accountTable.id],
  }),
  company: one(companyTable, {
    fields: [branchTable.company_id],
    references: [companyTable.id],
  }),
}));
