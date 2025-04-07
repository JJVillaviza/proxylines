import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import * as schemas from "@/database/schemas";

export const transactionEnum = pgEnum("transactionEnum", [
  "ongoing",
  "pending",
  "done",
]);

const transactionTable = pgTable("transactions", {
  id: uuid().primaryKey(),
  status: transactionEnum(),
  serviceId: uuid().notNull(),
  branchId: uuid().notNull(),
  clientId: uuid().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const transactionRelation = relations(transactionTable, ({ many }) => ({
  service: many(schemas.serviceTable),
  branch: many(schemas.branchTable),
  client: many(schemas.clientTable),
}));

export default transactionTable;
