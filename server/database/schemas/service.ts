import { relations } from "drizzle-orm";
import { pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";
import * as schemas from "./index";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const serviceInsertSchema = createInsertSchema(serviceTable, {
  name: z.string().min(3, { message: "Name must have atleast 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Name must have atleast 10 characters" })
    .optional()
    .or(z.literal("")),
  timeStart: z.string().time().or(z.literal("08:00")),
  timeEnd: z.string().time().or(z.literal("17:00")),
});

export const serviceRelation = relations(serviceTable, ({ one, many }) => ({
  company: one(schemas.companyTable, {
    fields: [serviceTable.companyId],
    references: [schemas.companyTable.id],
  }),
  requirement: many(schemas.requirementTable),
  transaction: one(schemas.transactionTable, {
    fields: [serviceTable.id],
    references: [schemas.transactionTable.serviceId],
  }),
}));

export default serviceTable;
