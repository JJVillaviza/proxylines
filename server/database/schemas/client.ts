import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import * as schemas from "./index";

const clientTable = pgTable("clients", {
  id: uuid("id").primaryKey(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").unique().notNull(),
  accountId: uuid("account_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const clientRelation = relations(clientTable, ({ one }) => ({
  account: one(schemas.accountTable, {
    fields: [clientTable.accountId],
    references: [schemas.accountTable.id],
  }),
}));

export default clientTable;
