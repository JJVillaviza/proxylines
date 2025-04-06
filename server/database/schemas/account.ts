import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import * as schemas from "./index";

export const accountEnum = pgEnum("accountTypes", [
  "company",
  "client",
  "courier",
]);

const accountTable = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  username: text("username").notNull().unique(),
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
  branch: one(schemas.branchTable, {
    fields: [accountTable.id],
    references: [schemas.branchTable.accountId],
  }),
  session: one(schemas.sessionTable, {
    fields: [accountTable.id],
    references: [schemas.sessionTable.token],
  }),
  client: one(schemas.clientTable, {
    fields: [accountTable.id],
    references: [schemas.clientTable.accountId],
  }),
}));

export default accountTable;
