import type { InferSelectModel } from "drizzle-orm";
import * as schemas from "@/database/schemas";

export type Session = InferSelectModel<typeof schemas.sessionTable>;
export type Account = InferSelectModel<typeof schemas.branchTable>;
export type Company = InferSelectModel<typeof schemas.companyTable>;
export type Service = InferSelectModel<typeof schemas.serviceTable>;
export type Requirement = InferSelectModel<typeof schemas.requirementTable>;
export type Client = InferSelectModel<typeof schemas.clientTable>;
export type Transaction = InferSelectModel<typeof schemas.transactionTable>;

export type Context = {
  Variables: {
    session: Session | null;
    account: Account | null;
    service: Service | null;
    client: Client | null;
  };
};
