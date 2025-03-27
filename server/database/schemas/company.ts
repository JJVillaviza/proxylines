import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import * as schemas from "./index";

const companyTable = pgTable("companies", {
  id: uuid("id").primaryKey(),
  businessName: text("business_name").notNull(),
  brandName: text("brand_name").notNull(),
  description: text("description"),
  vision: text("vision"),
  mission: text("mission"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const companyRelation = relations(companyTable, ({ many }) => ({
  branch: many(schemas.branchTable),
}));

export default companyTable;
