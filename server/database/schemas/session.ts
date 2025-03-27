import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import * as schemas from "./index";

const sessionTable = pgTable("sessions", {
  id: uuid("id").primaryKey(),
  token: uuid("token").notNull(),
  accountId: uuid("account_id").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const sessionRelation = relations(sessionTable, ({ one }) => ({
  account: one(schemas.accountTable, {
    fields: [sessionTable.token],
    references: [schemas.accountTable.id],
  }),
}));

export default sessionTable;
