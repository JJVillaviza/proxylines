import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import * as schemas from "@/database/schemas";

const requirementTable = pgTable("requirements", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  description: text(),
  serviceId: uuid().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const requirementRelation = relations(requirementTable, ({ one }) => ({
  service: one(schemas.serviceTable, {
    fields: [requirementTable.serviceId],
    references: [schemas.serviceTable.id],
  }),
}));

export default requirementTable;
