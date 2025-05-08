import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import * as schemas from "./index";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const branchEnum = pgEnum("branchTypes", ["main", "branch"]);

const branchTable = pgTable("branches", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  role: branchEnum(),
  email: text("email").notNull().unique(),
  companyId: uuid("company_id").notNull(),
  accountId: uuid("account_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const branchInsertSchema = createInsertSchema(branchTable, {
  name: z.string().min(3, { message: "Name must have atleast 3 characters" }),
});

export const branchRelation = relations(branchTable, ({ one }) => ({
  account: one(schemas.accountTable, {
    fields: [branchTable.accountId],
    references: [schemas.accountTable.id],
  }),
  company: one(schemas.companyTable, {
    fields: [branchTable.companyId],
    references: [schemas.companyTable.id],
  }),
  transaction: one(schemas.transactionTable, {
    fields: [branchTable.id],
    references: [schemas.transactionTable.branchId],
  }),
}));

export default branchTable;
