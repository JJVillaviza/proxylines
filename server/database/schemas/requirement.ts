import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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

export const requirementRelation = relations(requirementTable, ({}) => ({}));

export default requirementTable;
