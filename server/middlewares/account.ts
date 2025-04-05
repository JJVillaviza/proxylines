import type { Context } from "@/utilities/context";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const AccountMiddleware = createMiddleware<Context>(async (c, next) => {
  const account = c.get("account")!;

  if (account.role !== "main") {
    throw new HTTPException(409, { message: "Unauthorized! not main" });
  }

  return next();
});
