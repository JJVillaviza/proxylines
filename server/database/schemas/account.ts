import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { branchTable } from "./branch";
import { sessionTable } from "./session";

export const accountEnum = pgEnum("types", ["company", "client", "courier"]);

export const accountTable = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  type: accountEnum(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const accountRelation = relations(accountTable, ({ one }) => ({
  branch: one(branchTable, {
    fields: [accountTable.id],
    references: [branchTable.account_id],
  }),
  session: one(sessionTable, {
    fields: [accountTable.id],
    references: [sessionTable.token],
  }),
}));
