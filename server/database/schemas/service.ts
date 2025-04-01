import { relations } from "drizzle-orm";
import { pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";
import * as schemas from "./index";

const serviceTable = pgTable("services", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  timeStart: time("time_start").notNull(),
  timeEnd: time("time_end").notNull(),
  companyId: uuid().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const serviceRelation = relations(serviceTable, ({ one }) => ({
  company: one(schemas.companyTable, {
    fields: [serviceTable.companyId],
    references: [schemas.companyTable.id],
  }),
}));

export default serviceTable;
