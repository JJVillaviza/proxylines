import type { InferSelectModel } from "drizzle-orm";
import * as schemas from "@/database/schemas";

export type Session = InferSelectModel<typeof schemas.sessionTable>;
export type Account = InferSelectModel<typeof schemas.branchTable>;

export type Context = {
  Variables: {
    session: Session | null;
    account: Account | null;
  };
};
